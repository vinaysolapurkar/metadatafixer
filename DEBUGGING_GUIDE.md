# Debugging Guide - "No Metadata Found" Issue

If you're seeing "No metadata found" for all images, follow this guide to diagnose and fix the issue.

## 🔍 Step 1: Open Browser Console

### Chrome/Edge:
- Press `F12` or `Ctrl+Shift+J` (Windows/Linux)
- Press `Cmd+Option+J` (Mac)

### Firefox:
- Press `F12` or `Ctrl+Shift+K`

### Safari:
- Enable Developer menu: Preferences → Advanced → "Show Develop menu"
- Press `Cmd+Option+C`

## 📊 Step 2: Upload Your File and Watch Console

When you upload your ZIP file, you'll see console messages like:

```
Processing: IMG_1234.jpg (full path: Google Photos/IMG_1234.jpg)
Looking for JSON match for: Google Photos/IMG_1234.jpg
✅ Direct match found: Google Photos/IMG_1234.jpg.json
✅ Found metadata for IMG_1234.jpg
```

OR if no match:

```
Processing: IMG_1234.jpg (full path: Google Photos/IMG_1234.jpg)
Looking for JSON match for: Google Photos/IMG_1234.jpg
❌ No JSON match found for: Google Photos/IMG_1234.jpg
Available JSON files: ["IMG_5678.jpg.json", "IMG_9012.jpg.json", ...]
⚠️ No metadata JSON found for IMG_1234.jpg
```

## 🔧 Common Issues & Fixes

### Issue 1: File Name Mismatch

**Symptom:** Console shows different names for image vs JSON

**Example:**
```
Image file: IMG_1234.jpg
JSON file:  PXL_1234.jpg.json
```

**Solution:** Google may have renamed files during export. The enhanced matcher tries 6 different strategies:

1. **Direct match**: `IMG_1234.jpg` → `IMG_1234.jpg.json`
2. **No extension**: `IMG_1234.jpg` → `IMG_1234.json`
3. **Duplicates**: `IMG_1234(1).jpg` → `IMG_1234.jpg(1).json`
4. **Edited files**: `IMG_1234-edited.jpg` → `IMG_1234.jpg.json`
5. **Case insensitive**: `IMG_1234.JPG` → `img_1234.jpg.json`
6. **Partial match**: Finds similar base names

### Issue 2: Nested Folders

**Symptom:** Console shows full paths don't match

**Example:**
```
Image: Photos/2024/January/IMG_1234.jpg
JSON:  Photos/2024/IMG_1234.jpg.json
```

**Solution:** The new matcher ignores directory paths and matches only filenames.

### Issue 3: Large File Memory Issues

**Symptom:** Browser crashes or freezes with 1GB+ files

**Solutions:**
1. **Split the ZIP**: Break your 1GB file into smaller 200-300MB chunks
2. **Use Desktop Browser**: Mobile browsers have stricter memory limits
3. **Close Other Tabs**: Free up browser memory
4. **Try Firefox**: Often handles large files better than Chrome

### Issue 4: Corrupted or Incomplete Export

**Symptom:** JSON files exist but are empty or malformed

**Check Console For:**
```
Error parsing JSON: Unexpected token...
```

**Solution:** Re-export from Google Takeout, ensuring "Include photo metadata" is checked.

### Issue 5: JSON Files Missing Entirely

**Symptom:** Console shows empty JSON file list

**Example:**
```
Available JSON files: []
```

**Causes:**
- Exported from Google Photos without metadata option
- Extracted ZIP incorrectly
- JSON files filtered out by browser

**Solution:**
1. Re-export with "All photo data" option checked
2. Extract ZIP manually and check if .json files exist
3. Upload the extracted folder instead of ZIP

## 📝 What Console Messages Mean

### ✅ Success Messages

```
✅ Direct match found: path/to/file.jpg.json
✅ Found metadata for IMG_1234.jpg
```
**Meaning:** JSON file found and loaded successfully!

### ⚠️ Warning Messages

```
⚠️ Partial match found: similar_file.jpg.json
⚠️ No metadata JSON found for IMG_1234.jpg
```
**Meaning:** Trying fallback matching or no JSON exists

### ❌ Error Messages

```
❌ No JSON match found for: IMG_1234.jpg
Error processing IMG_1234.jpg: ...
```
**Meaning:** Failed to find matching JSON or processing error

## 🧪 Step 3: Test with Sample File First

Before processing your 1GB file:

1. **Download test sample:**
   ```
   https://github.com/vinaysolapurkar/metadatafixer/raw/refs/heads/claude/metadatafixer-clone-Z9ert/google-takeout-test-sample.zip
   ```

2. **Upload to Vercel app:**
   ```
   https://metadatafixer.vercel.app/
   ```

3. **Verify you see:**
   - 3 images with thumbnails
   - ✅ Metadata restored for all 3
   - Date, GPS, people shown in preview

If test sample works but your file doesn't, the issue is with your export.

## 🔬 Step 4: Analyze Your ZIP Structure

### Expected Structure:
```
takeout-xxx.zip
├── Photos from 2024/
│   ├── IMG_1234.jpg
│   ├── IMG_1234.jpg.json
│   ├── IMG_5678.jpg
│   └── IMG_5678.jpg.json
```

### Check Your Structure:
1. Extract your ZIP
2. Look for `.json` files next to images
3. Open a `.json` file in text editor
4. Verify it contains:
   ```json
   {
     "title": "IMG_1234.jpg",
     "photoTakenTime": { "timestamp": "..." },
     "geoData": { ... }
   }
   ```

## 📊 Step 5: Export File Name Patterns

### Check Console Output

Look for patterns in the filename mismatches:

**Pattern 1: Extension Mismatch**
```
Image: IMG_1234.HEIC
JSON:  IMG_1234.JPG.json
```
**Fix:** Manually rename or use partial match mode

**Pattern 2: Date Prefix**
```
Image: 20240101_IMG_1234.jpg
JSON:  IMG_1234.jpg.json
```
**Fix:** Need custom matcher (contact for help)

**Pattern 3: Google Auto-Rename**
```
Image: PXL_20240101_123456789.jpg
JSON:  original_name.jpg.json
```
**Fix:** Google renamed during upload, original metadata may be lost

## 🎯 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Browser console is open
- [ ] Uploaded file and checked console logs
- [ ] Verified JSON files exist in ZIP
- [ ] Tested with sample file (works = your export issue)
- [ ] Checked file name patterns in console
- [ ] No JavaScript errors in console
- [ ] Browser has enough memory (close other tabs)
- [ ] Using latest Chrome/Firefox/Safari

## 📸 Share Your Console Output

If still stuck, share your console output:

1. Open console
2. Upload your file
3. Take screenshot showing:
   - "Looking for JSON match for..." messages
   - "Available JSON files:" list
   - Any error messages

## 💡 Pro Tips

### Tip 1: Start Small
Process a few photos first (create small test ZIP) before trying 1GB file.

### Tip 2: Use grep to verify JSON content
```bash
unzip -p your-file.zip "*.json" | head -20
```

### Tip 3: Check JSON file size
If JSON files are 0 bytes or very small (<50 bytes), they're likely empty.

### Tip 4: Verify Google Takeout Settings
When creating export:
- ✅ Select "Google Photos"
- ✅ Check "Include all photo data"
- ✅ Choose "Multiple formats" for export
- ✅ Select reasonable size (2GB chunks)

## 🚨 Known Limitations

1. **HEIC files**: Need conversion to JPEG for EXIF embedding
2. **Videos**: Metadata restoration not yet supported
3. **Live Photos**: Each component processed separately
4. **Browser memory**: Large files (>1GB) may timeout

## 🔄 Alternative Solutions

If browser-based tool fails:

1. **Use command-line tools:**
   - exiftool with batch scripts
   - Python scripts (see METADATA_MAPPING.md)

2. **Process in chunks:**
   - Extract ZIP
   - Create smaller ZIPs (200-300 photos each)
   - Process separately
   - Combine results

3. **Use desktop app:**
   - Commercial tools if browser limitations too severe
   - Better memory management

---

## 📞 Still Need Help?

If none of this works:

1. **Create GitHub Issue:**
   - Include console output (screenshot)
   - Describe your export settings
   - Mention file size and photo count

2. **Share Sample Files:**
   - Create small test ZIP (5-10 photos)
   - Share structure (don't need actual photos)
   - Include 1-2 JSON file samples

---

**Remember:** The tool now has enhanced matching with 6 strategies and shows thumbnails with metadata preview. If you see thumbnails but no metadata, it means JSON files are missing or misnamed!
