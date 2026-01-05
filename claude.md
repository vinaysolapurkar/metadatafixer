# Metadata Fixer Clone - Research Document

## Project Overview

This document contains research findings for creating a clone of metadatafixer.com - a tool that restores EXIF metadata to photos and videos exported from Google Photos Takeout.

## What is Metadata Fixer?

Metadata Fixer is a desktop utility ($39 USD) that addresses a common problem: when users export their photos from Google Photos using Google Takeout, the metadata doesn't embed properly in the image files. Instead, Google provides separate JSON files containing all the metadata (timestamps, GPS coordinates, descriptions, tags, etc.).

### Core Functionality

- **Timestamp Recovery**: Restores original photo/video capture times for proper chronological ordering
- **File Naming**: Restores original filenames, descriptions, and tags
- **GPS Data**: Recovers geolocation coordinates (latitude/longitude) when available
- **Timezone Adjustment**: Corrects timestamps based on GPS location data
- **Duplicate Handling**: Processes files with "(1)" suffixes and similar variants
- **Format Support**: Handles JPG, PNG, MOV, MP4, GIF, AVI, and other common media formats

### Technical Approach

The tool uses **Phil Harvey's ExifTool** to:
1. Find each media file and its corresponding JSON file
2. Parse the JSON metadata
3. Merge/embed the metadata back into the media file
4. Create a single file containing both the media and its metadata

## Google Takeout JSON Format

When you export from Google Photos, each media file has a corresponding JSON file with this structure:

```json
{
  "title": "filename.jpg",
  "description": "",
  "imageViews": "0",
  "creationTime": {
    "timestamp": "1598032635",
    "formatted": "Aug 21, 2020, 5:57:15 PM UTC"
  },
  "photoTakenTime": {
    "timestamp": "1478174685",
    "formatted": "Nov 3, 2016, 12:04:45 PM UTC"
  },
  "geoData": {
    "latitude": 0.0,
    "longitude": 0.0,
    "altitude": 0.0,
    "latitudeSpan": 0.0,
    "longitudeSpan": 0.0
  },
  "geoDataExif": {
    "latitude": 0.0,
    "longitude": 0.0,
    "altitude": 0.0,
    "latitudeSpan": 0.0,
    "longitudeSpan": 0.0
  },
  "people": [
    { "name": "Person1" },
    { "name": "Person2" }
  ],
  "url": "{url to google content}",
  "googlePhotosOrigin": {
    "driveDesktopUploader": {
      "version": "BACKUP_AND_SYNC"
    }
  },
  "photoLastModifiedTime": {
    "timestamp": "1621834597",
    "formatted": "May 24, 2021, 5:36:37 AM UTC"
  }
}
```

### Key JSON Fields

- **photoTakenTime**: The original timestamp when the photo was taken
- **geoData/geoDataExif**: GPS coordinates (prefer geoDataExif as primary source)
- **description**: User-added description
- **people**: Names of recognized people in photos
- **title**: Original filename

### File Naming Conventions

- Standard: `photo.jpg` has metadata in `photo.jpg.json`
- Duplicates: `IMG123(1).jpg` has metadata in `IMG123.jpg(1).json`

## Implementation Plan

### Technology Stack

**Option 1: Web-based (Recommended for initial clone)**
- HTML/CSS/JavaScript (vanilla or React)
- ExifTool via WebAssembly or JavaScript library (exif-js, piexifjs)
- Client-side processing (no server needed for privacy)

**Option 2: Desktop Application**
- Python with ExifTool
- Electron wrapper for cross-platform GUI
- Node.js with sharp/exiftool libraries

**Option 3: Command-line Tool**
- Python with pillow and exiftool
- Node.js with exiftool
- Go for performance

### Core Algorithm

```
1. Accept input (ZIP file or folder)
2. Extract/scan files
3. For each media file:
   a. Find corresponding JSON file
   b. Parse JSON metadata
   c. Read current EXIF data from media file
   d. Merge JSON data into EXIF fields:
      - DateTimeOriginal ← photoTakenTime.timestamp
      - GPSLatitude ← geoDataExif.latitude (or geoData.latitude)
      - GPSLongitude ← geoDataExif.longitude (or geoData.longitude)
      - GPSAltitude ← geoDataExif.altitude
      - ImageDescription ← description
      - Keywords ← people[].name
   e. Write updated EXIF back to file
   f. Set file creation/modification timestamp
4. Create output folder with processed files
5. Optionally clean up JSON files
```

### Metadata Mapping

| JSON Field | EXIF Tag | Description |
|------------|----------|-------------|
| photoTakenTime.timestamp | DateTimeOriginal | Original capture time |
| geoDataExif.latitude | GPSLatitude | GPS latitude |
| geoDataExif.longitude | GPSLongitude | GPS longitude |
| geoDataExif.altitude | GPSAltitude | GPS altitude |
| description | ImageDescription | User description |
| people[].name | Keywords/Subject | People tags |
| title | FileName | Original filename |

## User Workflow

1. Export photos from Google Photos using Google Takeout
2. Download the ZIP files
3. Open Metadata Fixer tool
4. Drag and drop ZIP files (or select folder)
5. Process automatically
6. Get output folder with fixed metadata
7. Import to photo library (Apple Photos, Synology, etc.)

## Technical Challenges

1. **File Matching**: Handle various naming patterns (duplicates, special characters)
2. **EXIF Writing**: Different file formats require different approaches
3. **Video Support**: Video metadata is more complex than photos
4. **Performance**: Processing large libraries efficiently
5. **Error Handling**: Corrupted files, missing JSON, malformed data
6. **Timezone Handling**: Converting Unix timestamps to local times

## Implementation Approach

For our clone, we'll build:

1. **Web Interface**: Simple HTML/CSS/JavaScript frontend
2. **Client-side Processing**: Use JavaScript libraries to handle files
3. **Drag & Drop**: Accept ZIP files or folders
4. **Progress Tracking**: Show processing status
5. **Preview**: Display before/after metadata comparison
6. **Download**: Package processed files for download

### Libraries to Use

- **JSZip**: Extract ZIP files in browser
- **piexifjs**: Read/write EXIF data in JavaScript
- **exif-js**: Alternative EXIF library
- **date-fns**: Handle timestamp conversions

## Sources

Research compiled from:
- [Metadata Fixer For Google Photos Takeout](https://metadatafixer.com/)
- [How It Works - Metadata Fixer](https://metadatafixer.com/how-it-works)
- [GitHub - Google Photos Metadata Fix](https://github.com/joshua-holmes/google-photos-metadata-fix)
- [GitHub - Google Photos EXIF](https://github.com/mattwilson1024/google-photos-exif)
- [How to backup your photos from Google and fix the Exif metadata](https://blog.rpanachi.com/how-to-takeout-from-google-photos-and-fix-metadata-exif-info)

---

*Document created: 2026-01-05*
