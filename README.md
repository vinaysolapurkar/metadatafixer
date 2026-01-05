# Metadata Fixer - Google Photos Takeout Tool

A free, open-source web application that restores EXIF metadata to photos exported from Google Photos via Google Takeout.

## Overview

When you export photos from Google Photos using Google Takeout, the metadata (timestamps, GPS coordinates, descriptions, tags) doesn't get embedded in the image files. Instead, Google provides separate JSON files containing all the metadata. This tool automatically finds each photo's corresponding JSON file and merges the metadata back into the image.

## Features

- ⏰ **Complete Timestamp Restoration** - photoTakenTime, creationTime, lastModified with millisecond precision
- 🗺️ **Full GPS Data** - Latitude, longitude, altitude with GPS timestamp and processing method
- 👥 **People Recognition** - Restore people names as Artist, Keywords, and Windows XP tags
- 📝 **Rich Descriptions** - Title, description, and comments in multiple formats (ASCII, UTF-16, UserComment)
- 📱 **Device Information** - Camera make/model from Google Photos origin (Android, iOS, Desktop)
- ⭐ **Engagement Metrics** - Convert image views to 0-5 star ratings
- 🔗 **Source Tracking** - Preserve Google Photos URL as copyright information
- 🪟 **Windows Compatible** - XPTitle, XPComment, XPAuthor, XPKeywords for full Explorer integration
- 🔄 **Batch Processing** - Process unlimited photos at once
- 🖼️ **Format Support** - Works with JPG, JPEG (PNG for display only)
- 🔒 **100% Private** - All processing happens in your browser, photos never leave your device
- 💰 **Completely Free** - No subscription, no installation required
- 📊 **Better Than Commercial Tools** - Captures MORE metadata fields than $39 alternatives!

## How to Use

### Step 1: Export from Google Photos

1. Go to [Google Takeout](https://takeout.google.com/)
2. Select only "Google Photos"
3. Choose your export options (file type, size)
4. Download the ZIP file(s)

### Step 2: Process with Metadata Fixer

1. Open `index.html` in your web browser
2. Drag and drop your Google Takeout ZIP file onto the upload area
3. Wait for processing to complete (usually a few minutes)
4. Download the fixed photos with restored metadata

### Step 3: Import to Your Photo Library

Import the processed photos to:
- Apple Photos
- Google Photos (if needed)
- Synology Photos
- Any other photo management software

## Technical Details

### What Metadata Gets Restored

| JSON Field | EXIF Tags | Description |
|------------|-----------|-------------|
| photoTakenTime.timestamp | DateTimeOriginal, DateTimeDigitized, DateTime, GPSTimeStamp, GPSDateStamp | Primary capture time |
| creationTime.timestamp | DateTime (fallback) | Upload/creation time |
| photoLastModifiedTime.timestamp | SubSecTime | Last modification |
| geoDataExif.latitude | GPSLatitude, GPSLatitudeRef | GPS latitude (DMS format) |
| geoDataExif.longitude | GPSLongitude, GPSLongitudeRef | GPS longitude (DMS format) |
| geoDataExif.altitude | GPSAltitude, GPSAltitudeRef | GPS altitude with reference |
| title | DocumentName, XPTitle | Original filename (ASCII + UTF-16) |
| description | ImageDescription, UserComment, XPComment | Description in 3 formats |
| people[].name | Artist, XPAuthor, XPKeywords | People names (semicolon-separated) |
| imageViews | Rating | View count → 0-5 star rating |
| url | Copyright | Google Photos URL |
| googlePhotosOrigin | Make, Model | Device info (Google Photos, device type) |
| - | Software, ProcessingSoftware | "Metadata Fixer" branding |
| - | ExifVersion, ColorSpace, Orientation | Technical metadata (EXIF 2.31, sRGB) |

**📚 See [METADATA_MAPPING.md](METADATA_MAPPING.md) for complete technical details, validation instructions, and comparison with commercial tools.**

### How It Works

1. **Extract ZIP** - Unzips the Google Takeout archive
2. **Find Pairs** - Matches each image with its corresponding JSON file
3. **Parse Metadata** - Extracts metadata from JSON files
4. **Embed EXIF** - Writes metadata into image EXIF fields
5. **Package Results** - Creates downloadable ZIP with fixed photos

### Technology Stack

- **HTML/CSS/JavaScript** - Pure vanilla JS, no framework needed
- **JSZip** - ZIP file extraction and creation
- **piexifjs** - EXIF metadata reading and writing

## Installation

No installation required! Just open `index.html` in any modern web browser.

### Running Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/metadatafixer.git
cd metadatafixer

# Open in browser (no build step needed!)
open index.html
# or
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Hosting on GitHub Pages

1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Select main branch
4. Your site will be available at `https://yourusername.github.io/metadatafixer/`

## File Structure

```
metadatafixer/
├── index.html          # Main HTML file with UI
├── style.css           # Styling and responsive design
├── app.js              # Core processing logic
├── README.md           # This file
└── claude.md           # Research documentation
```

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## Limitations

- **Image Formats**: EXIF embedding currently only works for JPEG/JPG files. PNG and other formats will be processed but metadata may not embed correctly.
- **Video Files**: Video metadata restoration is not yet supported (MP4, MOV, etc.)
- **Browser Memory**: Very large ZIP files (>2GB) may cause browser memory issues
- **Processing Time**: Large libraries may take several minutes to process

## FAQ

### Is my data safe?

Yes! All processing happens entirely in your browser using JavaScript. Your photos are never uploaded to any server. The code runs 100% client-side.

### Why are some photos not getting metadata?

This can happen if:
- The JSON file is missing or corrupted
- The file naming doesn't match Google's pattern
- The photo was uploaded without location/date information originally

### Can I use this for other cloud services?

This tool is specifically designed for Google Photos Takeout format. Other services (iCloud, OneDrive, etc.) use different export formats.

### Does this work on mobile?

The web interface works on mobile browsers, but processing large ZIP files on mobile devices may be slow or cause memory issues. Desktop browsers are recommended.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

### Future Improvements

- [ ] Support for video files (MP4, MOV)
- [ ] PNG metadata embedding
- [ ] Progress estimation with time remaining
- [ ] Batch ZIP processing (multiple ZIPs at once)
- [ ] Advanced filtering options
- [ ] Metadata preview before processing
- [ ] Export to different formats

## License

MIT License - feel free to use, modify, and distribute.

## Acknowledgments

- Inspired by [metadatafixer.com](https://metadatafixer.com/)
- Uses [JSZip](https://stuk.github.io/jszip/) for ZIP handling
- Uses [piexifjs](https://github.com/hMatoba/piexifjs) for EXIF manipulation
- Based on Google Photos Takeout format documentation

## Support

If you find this tool helpful, please:
- ⭐ Star this repository
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Discussions
- 📢 Share with others who need it

## Alternative Tools

If this tool doesn't meet your needs, check out:
- [metadatafixer.com](https://metadatafixer.com/) - Commercial desktop app ($39)
- [google-photos-exif](https://github.com/mattwilson1024/google-photos-exif) - Command-line Node.js tool
- [google-photos-metadata-fix](https://github.com/joshua-holmes/google-photos-metadata-fix) - Python CLI tool

---

**Made with ❤️ for the open-source community**

*Last updated: January 2026*
