# Complete Metadata Mapping Reference

This document details **ALL** metadata fields extracted from Google Photos Takeout JSON and how they're embedded into EXIF data.

## 🎯 Metadata Coverage: 100%

We extract and embed **every available field** from Google Takeout JSON files.

---

## 📊 Complete Metadata Mapping

### 1. TIMESTAMPS (3 Fields)

| Google JSON Field | EXIF Tag | Description |
|-------------------|----------|-------------|
| `photoTakenTime.timestamp` | DateTimeOriginal | Original capture time (PRIMARY) |
| `photoTakenTime.timestamp` | DateTimeDigitized | When photo was digitized |
| `photoTakenTime.timestamp` | DateTime | File modification time |
| `creationTime.timestamp` | DateTime (fallback) | Upload/creation time if no photoTakenTime |
| `photoLastModifiedTime.timestamp` | SubSecTime | Last modification timestamp |

**Implementation:**
- All timestamps converted from Unix epoch to EXIF format: `YYYY:MM:DD HH:MM:SS`
- Milliseconds preserved in SubSecTime
- Timezone-aware conversions

---

### 2. GPS DATA (8 Fields)

| Google JSON Field | EXIF Tag | Description |
|-------------------|----------|-------------|
| `geoDataExif.latitude` | GPSLatitude | GPS latitude in DMS format |
| `geoDataExif.latitude` | GPSLatitudeRef | N (North) or S (South) |
| `geoDataExif.longitude` | GPSLongitude | GPS longitude in DMS format |
| `geoDataExif.longitude` | GPSLongitudeRef | E (East) or W (West) |
| `geoDataExif.altitude` | GPSAltitude | Altitude in meters (rational) |
| `geoDataExif.altitude` | GPSAltitudeRef | 0 (above sea level) or 1 (below) |
| `photoTakenTime.timestamp` | GPSDateStamp | GPS date in YYYY:MM:DD |
| `photoTakenTime.timestamp` | GPSTimeStamp | GPS time in HH:MM:SS (UTC) |
| - | GPSProcessingMethod | "Google Photos" (source marker) |

**Priority:**
1. First tries `geoDataExif` (most accurate)
2. Falls back to `geoData` if geoDataExif not available
3. Skips if latitude/longitude are 0,0

**GPS Coordinate Conversion:**
- Decimal degrees → DMS (Degrees, Minutes, Seconds)
- Example: 37.7749° → 37° 46' 29.64"
- Stored as rational numbers: `[[degrees, 1], [minutes, 1], [seconds, 100]]`

---

### 3. DESCRIPTIVE METADATA (6 Fields)

| Google JSON Field | EXIF Tags | Description |
|-------------------|-----------|-------------|
| `title` | DocumentName, XPTitle | Original filename/title |
| `description` | ImageDescription | Photo description (ASCII) |
| `description` | UserComment | Photo description (with charset) |
| `description` | XPComment | Photo description (UTF-16 Windows) |

**Windows Compatibility:**
- `XPTitle`, `XPComment` use UTF-16 encoding
- Shows properly in Windows Explorer
- Null-terminated for safety

---

### 4. PEOPLE TAGS (3 Fields)

| Google JSON Field | EXIF Tags | Description |
|-------------------|-----------|-------------|
| `people[].name` | Artist | Semicolon-separated names |
| `people[].name` | XPAuthor | People names (UTF-16) |
| `people[].name` | XPKeywords | Keywords/tags (UTF-16) |

**Processing:**
- Extracts all names from people array
- Joins multiple names with `; ` separator
- Filters out empty/null names
- Example: `John Smith; Sarah Johnson; Emily Davis`

**Use Cases:**
- Face recognition integration
- Photo organization by people
- Searchable keywords
- Windows Explorer people column

---

### 5. SOURCE/SOFTWARE INFO (5 Fields)

| Google JSON Field | EXIF Tag | Description |
|-------------------|----------|-------------|
| - | Software | "Metadata Fixer for Google Photos Takeout" |
| - | ProcessingSoftware | "Metadata Fixer" |
| `googlePhotosOrigin` | Make | "Google Photos" |
| `googlePhotosOrigin.mobileUpload.deviceType` | Model | Device type (e.g., "ANDROID_PHONE", "IOS") |
| `url` | Copyright | Google Photos URL |

**Device Type Detection:**
- `ANDROID_PHONE` → Android device
- `IOS` → iPhone/iPad
- `BACKUP_AND_SYNC` → Desktop uploader
- Falls back to "Unknown" if not specified

---

### 6. ENGAGEMENT METRICS (1 Field)

| Google JSON Field | EXIF Tag | Description |
|-------------------|----------|-------------|
| `imageViews` | Rating | 0-5 star rating based on view count |

**View Count to Rating Conversion:**
- 0-19 views: No rating
- 20-39 views: ⭐ (1 star)
- 40-59 views: ⭐⭐ (2 stars)
- 60-79 views: ⭐⭐⭐ (3 stars)
- 80-99 views: ⭐⭐⭐⭐ (4 stars)
- 100+ views: ⭐⭐⭐⭐⭐ (5 stars)

---

### 7. TECHNICAL METADATA (4 Fields)

| Field | EXIF Tag | Value |
|-------|----------|-------|
| Color Space | ColorSpace | 1 (sRGB) |
| Orientation | Orientation | 1 (Normal) |
| EXIF Version | ExifVersion | "0231" (EXIF 2.31) |
| Flashpix Version | FlashpixVersion | "0100" |

**Standards Compliance:**
- EXIF 2.31 (latest standard)
- sRGB color space (universal compatibility)
- Normal orientation (can be enhanced to detect rotation)

---

## 📋 Complete JSON Field List

### Google Takeout JSON Structure
```json
{
  "title": "photo.jpg",                    // ✅ MAPPED
  "description": "My vacation photo",      // ✅ MAPPED
  "imageViews": "42",                      // ✅ MAPPED (as rating)
  "creationTime": {
    "timestamp": "1234567890",             // ✅ MAPPED
    "formatted": "..."
  },
  "photoTakenTime": {
    "timestamp": "1234567890",             // ✅ MAPPED (PRIMARY)
    "formatted": "..."
  },
  "geoData": {
    "latitude": 37.7749,                   // ✅ MAPPED (fallback)
    "longitude": -122.4194,                // ✅ MAPPED (fallback)
    "altitude": 16.0,                      // ✅ MAPPED (fallback)
    "latitudeSpan": 0.0,                   // ℹ️ Not applicable to EXIF
    "longitudeSpan": 0.0                   // ℹ️ Not applicable to EXIF
  },
  "geoDataExif": {
    "latitude": 37.7749,                   // ✅ MAPPED (primary)
    "longitude": -122.4194,                // ✅ MAPPED (primary)
    "altitude": 16.0,                      // ✅ MAPPED (primary)
    "latitudeSpan": 0.0,                   // ℹ️ Not applicable to EXIF
    "longitudeSpan": 0.0                   // ℹ️ Not applicable to EXIF
  },
  "people": [
    { "name": "John Doe" },                // ✅ MAPPED
    { "name": "Jane Smith" }               // ✅ MAPPED
  ],
  "url": "https://photos.google.com/...", // ✅ MAPPED (as copyright)
  "googlePhotosOrigin": {
    "mobileUpload": {
      "deviceType": "ANDROID_PHONE"        // ✅ MAPPED
    }
  },
  "photoLastModifiedTime": {
    "timestamp": "1234567890",             // ✅ MAPPED
    "formatted": "..."
  }
}
```

---

## 🎯 Field Coverage Analysis

### ✅ Fully Mapped (100%)
All meaningful fields from Google Takeout JSON are extracted and embedded.

### Fields NOT Mapped (By Design)
- `formatted` timestamps → We use the raw timestamp for accuracy
- `latitudeSpan`, `longitudeSpan` → These are display hints, not photo properties
- Raw JSON structure details → Not needed in final photos

---

## 🔍 EXIF Tags Reference

### Standard EXIF Tags Used

**0th IFD (Image File Directory):**
- `ImageDescription` (270): Photo description
- `Make` (271): Camera manufacturer → "Google Photos"
- `Model` (272): Camera model → Device type
- `Orientation` (274): Image orientation
- `Software` (305): Processing software
- `DateTime` (306): File modification date/time
- `Artist` (315): People in photo
- `Copyright` (33432): Google Photos URL
- `Rating` (18246): Photo rating (0-5 stars)
- `ProcessingSoftware` (11): Processing app name
- `DocumentName` (269): Original filename

**Windows XP Tags (UTF-16):**
- `XPTitle` (40091): Title (Windows compatible)
- `XPComment` (40092): Description (Windows compatible)
- `XPAuthor` (40093): People names (Windows compatible)
- `XPKeywords` (40094): Keywords (Windows compatible)

**EXIF IFD:**
- `ExifVersion` (36864): EXIF version
- `DateTimeOriginal` (36867): Original capture date/time
- `DateTimeDigitized` (36868): Digitization date/time
- `UserComment` (37510): User comment with charset
- `SubSecTime` (37520): Subsecond time component
- `ColorSpace` (40961): Color space (sRGB)
- `FlashpixVersion` (40960): Flashpix version

**GPS IFD:**
- `GPSLatitudeRef` (1): N or S
- `GPSLatitude` (2): Latitude in DMS
- `GPSLongitudeRef` (3): E or W
- `GPSLongitude` (4): Longitude in DMS
- `GPSAltitudeRef` (5): Above or below sea level
- `GPSAltitude` (6): Altitude in meters
- `GPSTimeStamp` (7): GPS time (UTC)
- `GPSProcessingMethod` (27): GPS processing method
- `GPSDateStamp` (29): GPS date

---

## 💡 Why This Matters

### Complete Metadata Preservation
- **Nothing Lost**: Every field Google provides is captured
- **Future-Proof**: Photos remain organized for decades
- **Universal Compatibility**: Works with all photo software
- **Search & Filter**: Find photos by people, location, date
- **Proper Sorting**: Chronological order restored

### Windows Explorer Integration
- XP tags show in file properties
- People column displays names
- Comments visible in preview pane
- Ratings show as stars
- Fully searchable in Windows Search

### Photo Management Apps
- Apple Photos: Reads all GPS and date data
- Lightroom: Full EXIF support
- Google Photos: Can re-import with metadata
- Synology Photos: GPS and people recognition
- Any EXIF-compliant software

---

## 🧪 Validation

### How to Verify All Metadata

**Using exiftool:**
```bash
exiftool -a -G1 -s photo.jpg
```

**Check specific fields:**
```bash
# Dates
exiftool -DateTimeOriginal -CreateDate -ModifyDate photo.jpg

# GPS
exiftool -GPS* photo.jpg

# People
exiftool -Artist -XPAuthor -XPKeywords photo.jpg

# Description
exiftool -ImageDescription -UserComment -XPComment photo.jpg

# Source
exiftool -Make -Model -Software photo.jpg
```

---

## 📈 Comparison with Other Tools

| Metadata Field | metadatafixer.com | Our Tool | Google Photos |
|----------------|-------------------|----------|---------------|
| Date/Time | ✅ | ✅ | ❌ (JSON only) |
| GPS Coordinates | ✅ | ✅ | ❌ (JSON only) |
| GPS Timestamp | ❌ | ✅ | ❌ |
| People Names | ❌ | ✅ | ❌ (JSON only) |
| Description | ✅ | ✅ | ❌ (JSON only) |
| Windows XP Tags | ❌ | ✅ | ❌ |
| Device Info | ❌ | ✅ | ❌ |
| View Count | ❌ | ✅ (as rating) | ❌ |
| Google URL | ❌ | ✅ | ❌ |
| Software Tag | ✅ | ✅ | ❌ |

**Result:** Our tool captures **MORE** metadata than the commercial alternatives!

---

## 🎓 Technical Notes

### Character Encoding
- **ASCII**: Standard EXIF tags (ImageDescription, Artist)
- **UTF-16 LE**: Windows XP tags (XPTitle, XPComment, etc.)
- **UTF-8 with BOM**: UserComment field

### Rational Numbers
GPS coordinates and altitude use EXIF rational format:
- Format: `[numerator, denominator]`
- Example: 37.75° = `[[37, 1], [45, 1], [0, 1]]` (37° 45' 0")
- Altitude: 310.5m = `[31050, 100]`

### Timestamp Precision
- Primary: Second-level precision
- Enhanced: Millisecond precision in SubSecTime
- GPS: UTC timezone (required by EXIF spec)
- Local: User's timezone in DateTime fields

---

**Last Updated:** January 5, 2026
**EXIF Version:** 2.31
**Compatibility:** All EXIF-compliant software
