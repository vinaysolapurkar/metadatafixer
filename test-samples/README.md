# Test Sample Files for Metadata Fixer

This directory contains sample Google Takeout files for testing the Metadata Fixer application.

## What's Included

### 📦 google-takeout-test-sample.zip

A complete test ZIP file containing:

1. **vacation-beach-photo.jpg** + JSON metadata
   - Location: Nagpur, India (21.1458°N, 79.0882°E)
   - Date: August 1, 2024
   - Description: "Beautiful sunset at the beach during our summer vacation 2024"
   - People: John Smith, Sarah Johnson
   - Altitude: 310.5m

2. **family-reunion-2024.jpg** + JSON metadata
   - Location: San Francisco, CA (37.7749°N, -122.4194°W)
   - Date: January 1, 2024
   - Description: "Annual family reunion at grandmother's house"
   - People: Grandma Rose, Uncle Bob, Cousin Emily
   - Altitude: 16m

3. **mountain-hiking-trip.jpg** + JSON metadata
   - Location: New York area (40.7128°N, -74.0060°W)
   - Date: September 1, 2023
   - Description: "Reached the summit after 6 hour hike!"
   - Altitude: 1500m

## How to Use

### Test on Vercel Deployment

1. Open: https://metadatafixer.vercel.app/
2. Download `google-takeout-test-sample.zip` from this directory
3. Drag and drop the ZIP file onto the upload area
4. Wait for processing
5. Check the results:
   - All 3 photos should be processed
   - Metadata should be embedded in EXIF
   - GPS coordinates should be restored
   - Timestamps should be correct

### Test Locally

1. Open `index.html` in your browser
2. Upload the test ZIP file
3. Verify processing completes successfully

## Expected Results

After processing, the images should have:

✅ **EXIF DateTimeOriginal** set from `photoTakenTime`
✅ **GPS Latitude/Longitude** from `geoDataExif`
✅ **GPS Altitude** from `geoDataExif`
✅ **Image Description** from `description` field
✅ **Keywords** from `people` names

## Metadata Details

### Vacation Beach Photo
```json
{
  "photoTakenTime": "Aug 1, 2024, 12:00:00 AM UTC",
  "location": "21.1458°N, 79.0882°E (Nagpur, India)",
  "description": "Beautiful sunset at the beach",
  "people": ["John Smith", "Sarah Johnson"]
}
```

### Family Reunion
```json
{
  "photoTakenTime": "Jan 1, 2024, 12:00:00 AM UTC",
  "location": "37.7749°N, -122.4194°W (San Francisco)",
  "description": "Annual family reunion",
  "people": ["Grandma Rose", "Uncle Bob", "Cousin Emily"]
}
```

### Mountain Hiking
```json
{
  "photoTakenTime": "Sep 1, 2023, 12:00:00 AM UTC",
  "location": "40.7128°N, -74.0060°W (New York area)",
  "description": "Reached the summit after 6 hour hike!",
  "altitude": "1500m"
}
```

## Testing Checklist

- [ ] Upload ZIP file successfully
- [ ] Processing shows progress bar
- [ ] All 3 files are detected
- [ ] Metadata is matched correctly
- [ ] Processing completes without errors
- [ ] Download button appears
- [ ] Downloaded ZIP contains processed files
- [ ] EXIF data is embedded in JPEGs
- [ ] File names are preserved
- [ ] No JSON files in output

## Verifying EXIF Data

After downloading the processed photos, verify EXIF data:

### Using Command Line (exiftool)
```bash
exiftool vacation-beach-photo.jpg | grep -i "date\|gps\|description"
```

### Using Online Tool
Upload to: https://exif.regex.info/exif.cgi

### What to Look For
- **DateTimeOriginal**: Should match photoTakenTime
- **GPSLatitude**: Should match geoDataExif latitude
- **GPSLongitude**: Should match geoDataExif longitude
- **ImageDescription**: Should contain the description text

## Troubleshooting

### Files Not Matching
- JSON file names must match image names
- Check for proper `.jpg.json` suffix

### No Metadata Restored
- Verify JSON is valid format
- Check browser console for errors
- Ensure using JPEG images (PNG doesn't support full EXIF)

### Processing Fails
- Check file size limits
- Verify ZIP is not corrupted
- Try with smaller sample first

## Creating Your Own Test Files

To create additional test files:

1. Export real photos from Google Takeout
2. Select a small subset (5-10 photos)
3. Keep the JSON files paired with images
4. Create a ZIP file
5. Test with the app

---

**Test File Created**: January 5, 2026
**File Size**: 3.6 KB
**Photos Included**: 3
**JSON Files Included**: 3
