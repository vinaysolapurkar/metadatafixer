// Metadata Fixer Application
// Processes Google Photos Takeout files and restores EXIF metadata

class MetadataFixer {
    constructor() {
        this.files = [];
        this.processedFiles = [];
        this.stats = {
            total: 0,
            processed: 0,
            failed: 0,
            withMetadata: 0
        };
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });

        // File input change event
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
    }

    async handleFiles(files) {
        console.log('Files selected:', files.length);

        // Show processing status
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('processingStatus').style.display = 'block';

        try {
            for (const file of files) {
                if (file.name.endsWith('.zip')) {
                    await this.processZipFile(file);
                } else {
                    console.warn('Skipping non-ZIP file:', file.name);
                }
            }

            this.showResults();
        } catch (error) {
            console.error('Error processing files:', error);
            this.updateStatus('Error: ' + error.message);
        }
    }

    async processZipFile(zipFile) {
        this.updateStatus('Extracting ZIP file...');
        this.updateProgress(10);

        try {
            const zip = await JSZip.loadAsync(zipFile);
            const fileEntries = Object.values(zip.files).filter(f => !f.dir);

            console.log('Found files in ZIP:', fileEntries.length);

            // Separate image files and JSON files
            const imageFiles = fileEntries.filter(f => this.isImageFile(f.name));
            const jsonFiles = fileEntries.filter(f => f.name.endsWith('.json'));

            console.log('Image files:', imageFiles.length);
            console.log('JSON files:', jsonFiles.length);

            this.stats.total = imageFiles.length;
            this.updateProgress(20);

            // Create a map of JSON files for quick lookup
            const jsonMap = new Map();
            for (const jsonFile of jsonFiles) {
                const content = await jsonFile.async('text');
                jsonMap.set(jsonFile.name, JSON.parse(content));
            }

            this.updateStatus(`Processing ${imageFiles.length} images...`);
            this.updateProgress(30);

            // Process each image file
            for (let i = 0; i < imageFiles.length; i++) {
                const imageFile = imageFiles[i];
                const progress = 30 + (i / imageFiles.length) * 60;
                this.updateProgress(progress);

                await this.processImageFile(imageFile, jsonMap, zip);
            }

            this.updateProgress(100);

        } catch (error) {
            console.error('Error processing ZIP:', error);
            throw new Error('Failed to process ZIP file: ' + error.message);
        }
    }

    async processImageFile(imageFile, jsonMap, zip) {
        try {
            const imageName = imageFile.name.split('/').pop();
            const jsonName = this.findJsonForImage(imageName, jsonMap);

            console.log(`Processing: ${imageName}`);

            const imageData = await imageFile.async('base64');
            let metadata = null;

            if (jsonName) {
                metadata = jsonMap.get(jsonName);
                console.log(`Found metadata for ${imageName}:`, metadata);
            }

            // Process the image with metadata
            const processedImage = await this.embedMetadata(imageData, metadata, imageName);

            this.processedFiles.push({
                name: imageName,
                data: processedImage,
                hadMetadata: !!metadata
            });

            this.stats.processed++;
            if (metadata) {
                this.stats.withMetadata++;
            }

            this.addFileToList(imageName, !!metadata);

        } catch (error) {
            console.error(`Error processing ${imageFile.name}:`, error);
            this.stats.failed++;
            this.addFileToList(imageFile.name.split('/').pop(), false, true);
        }
    }

    findJsonForImage(imageName, jsonMap) {
        // Try direct match: image.jpg -> image.jpg.json
        const directMatch = imageName + '.json';
        for (const key of jsonMap.keys()) {
            if (key.endsWith(directMatch)) {
                return key;
            }
        }

        // Try without extension: image.jpg -> image.json
        const nameWithoutExt = imageName.replace(/\.[^/.]+$/, '');
        const altMatch = nameWithoutExt + '.json';
        for (const key of jsonMap.keys()) {
            if (key.endsWith(altMatch)) {
                return key;
            }
        }

        // Try handling duplicates: image(1).jpg -> image.jpg(1).json
        const dupMatch = imageName.replace(/\((\d+)\)\.([^.]+)$/, '.$2($1).json');
        for (const key of jsonMap.keys()) {
            if (key.endsWith(dupMatch)) {
                return key;
            }
        }

        return null;
    }

    async embedMetadata(base64Data, metadata, filename) {
        try {
            // Only process JPEG images for EXIF embedding
            if (!filename.toLowerCase().match(/\.(jpg|jpeg)$/)) {
                console.log(`Skipping non-JPEG file: ${filename}`);
                return base64Data;
            }

            if (!metadata) {
                console.log(`No metadata for: ${filename}`);
                return base64Data;
            }

            // Create EXIF data from Google metadata
            const exifObj = this.createExifFromMetadata(metadata);

            // Insert EXIF into image
            const exifBytes = piexif.dump(exifObj);
            const newData = piexif.insert(exifBytes, 'data:image/jpeg;base64,' + base64Data);

            // Return base64 without data URL prefix
            return newData.split(',')[1];

        } catch (error) {
            console.error(`Error embedding metadata for ${filename}:`, error);
            // Return original data if embedding fails
            return base64Data;
        }
    }

    createExifFromMetadata(metadata) {
        const exifObj = {
            "0th": {},
            "Exif": {},
            "GPS": {},
            "Interop": {},
            "1st": {},
            "thumbnail": null
        };

        try {
            // Add timestamp
            if (metadata.photoTakenTime && metadata.photoTakenTime.timestamp) {
                const date = new Date(parseInt(metadata.photoTakenTime.timestamp) * 1000);
                const dateStr = this.formatDateForExif(date);
                exifObj["Exif"][piexif.ExifIFD.DateTimeOriginal] = dateStr;
                exifObj["Exif"][piexif.ExifIFD.DateTimeDigitized] = dateStr;
                exifObj["0th"][piexif.ImageIFD.DateTime] = dateStr;
            }

            // Add GPS data (prefer geoDataExif over geoData)
            const geoData = metadata.geoDataExif || metadata.geoData;
            if (geoData && geoData.latitude !== 0 && geoData.longitude !== 0) {
                // Convert decimal degrees to degrees, minutes, seconds
                exifObj["GPS"][piexif.GPSIFD.GPSLatitude] = this.decimalToDMS(Math.abs(geoData.latitude));
                exifObj["GPS"][piexif.GPSIFD.GPSLatitudeRef] = geoData.latitude >= 0 ? 'N' : 'S';
                exifObj["GPS"][piexif.GPSIFD.GPSLongitude] = this.decimalToDMS(Math.abs(geoData.longitude));
                exifObj["GPS"][piexif.GPSIFD.GPSLongitudeRef] = geoData.longitude >= 0 ? 'E' : 'W';

                if (geoData.altitude) {
                    exifObj["GPS"][piexif.GPSIFD.GPSAltitude] = [Math.abs(geoData.altitude), 1];
                    exifObj["GPS"][piexif.GPSIFD.GPSAltitudeRef] = geoData.altitude >= 0 ? 0 : 1;
                }
            }

            // Add description
            if (metadata.description) {
                exifObj["0th"][piexif.ImageIFD.ImageDescription] = metadata.description;
            }

            // Add title
            if (metadata.title) {
                exifObj["0th"][piexif.ImageIFD.DocumentName] = metadata.title;
            }

        } catch (error) {
            console.error('Error creating EXIF:', error);
        }

        return exifObj;
    }

    formatDateForExif(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
    }

    decimalToDMS(decimal) {
        const degrees = Math.floor(decimal);
        const minutesDecimal = (decimal - degrees) * 60;
        const minutes = Math.floor(minutesDecimal);
        const seconds = Math.round((minutesDecimal - minutes) * 60 * 100);
        return [[degrees, 1], [minutes, 1], [seconds, 100]];
    }

    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const lowerName = filename.toLowerCase();
        return imageExtensions.some(ext => lowerName.endsWith(ext));
    }

    updateStatus(message) {
        document.getElementById('statusText').textContent = message;
    }

    updateProgress(percentage) {
        document.getElementById('progressFill').style.width = percentage + '%';
    }

    addFileToList(filename, hadMetadata, isError = false) {
        const filesList = document.getElementById('filesList');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        if (isError) {
            fileItem.classList.add('error');
            fileItem.innerHTML = `<span>❌</span> <span>${filename} - Failed</span>`;
        } else if (hadMetadata) {
            fileItem.classList.add('success');
            fileItem.innerHTML = `<span>✅</span> <span>${filename} - Metadata restored</span>`;
        } else {
            fileItem.innerHTML = `<span>⚠️</span> <span>${filename} - No metadata found</span>`;
        }

        filesList.appendChild(fileItem);
    }

    showResults() {
        document.getElementById('processingStatus').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';

        const statsHtml = `
            <div class="stat-card">
                <h4>${this.stats.total}</h4>
                <p>Total Files</p>
            </div>
            <div class="stat-card">
                <h4>${this.stats.processed}</h4>
                <p>Successfully Processed</p>
            </div>
            <div class="stat-card">
                <h4>${this.stats.withMetadata}</h4>
                <p>Metadata Restored</p>
            </div>
            <div class="stat-card">
                <h4>${this.stats.failed}</h4>
                <p>Failed</p>
            </div>
        `;

        document.getElementById('resultsStats').innerHTML = statsHtml;

        // Setup download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadProcessedFiles();
        });
    }

    async downloadProcessedFiles() {
        this.updateStatus('Creating download package...');

        try {
            const zip = new JSZip();
            const folder = zip.folder('fixed-photos');

            for (const file of this.processedFiles) {
                // Convert base64 to blob
                const binaryData = atob(file.data);
                const bytes = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    bytes[i] = binaryData.charCodeAt(i);
                }
                folder.file(file.name, bytes);
            }

            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            // Create download link
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fixed-photos.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.updateStatus('Download started!');

        } catch (error) {
            console.error('Error creating download:', error);
            alert('Error creating download package: ' + error.message);
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Metadata Fixer initialized');
    new MetadataFixer();
});
