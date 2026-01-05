# Testing Metadata Fixer on Mobile Devices

This guide explains how to test the Metadata Fixer app on your mobile phone or tablet.

## Method 1: Local Network Testing (Recommended)

### Step 1: Start the Server on Your Computer

On your computer, navigate to the project directory and start a local server:

```bash
cd /home/user/metadatafixer
python3 -m http.server 8000
```

Or if you have Node.js installed:

```bash
npx http-server -p 8000
```

### Step 2: Find Your Computer's IP Address

**On Linux/Mac:**
```bash
hostname -I
# or
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
# Look for "IPv4 Address" under your active network adapter
```

Your IP will look something like: `192.168.1.100` or `10.0.0.5`

### Step 3: Access from Mobile

1. Make sure your mobile device is on the **same WiFi network** as your computer
2. Open a browser on your mobile (Chrome, Safari, Firefox, etc.)
3. Enter the URL: `http://YOUR_IP_ADDRESS:8000`
   - Example: `http://192.168.1.100:8000`

### Step 4: Test the App

- The app should load just like on desktop
- You can tap the upload button to select files
- On iOS: You can select files from Files app or iCloud
- On Android: You can select from your file manager

## Method 2: Deploy to GitHub Pages (Best for Real Testing)

### Step 1: Push to GitHub

```bash
git push origin claude/metadatafixer-clone-Z9ert
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select the branch (e.g., `claude/metadatafixer-clone-Z9ert`)
4. Click **Save**
5. Your site will be available at: `https://yourusername.github.io/metadatafixer/`

### Step 3: Access from Any Mobile Device

- Open the GitHub Pages URL on your mobile
- Works from anywhere, no network configuration needed
- Bookmark it for easy access

## Method 3: Use Ngrok (For External Access)

If you want to test from a different network or share with others:

### Step 1: Install Ngrok

```bash
# Download from https://ngrok.com/download
# Or use package manager
brew install ngrok    # Mac
snap install ngrok    # Linux
```

### Step 2: Start Your Local Server

```bash
python3 -m http.server 8000
```

### Step 3: Create Ngrok Tunnel

In a new terminal:

```bash
ngrok http 8000
```

### Step 4: Use the Ngrok URL

Ngrok will provide a public URL like:
```
https://abc123.ngrok.io
```

Access this URL from any mobile device anywhere in the world!

## Method 4: Use a Cloud IDE with Preview

If you're using a cloud IDE (like GitHub Codespaces, Gitpod, Replit):

1. Start the server: `python3 -m http.server 8000`
2. The IDE will provide a preview URL
3. Open that URL on your mobile device

## Testing Checklist for Mobile

Once you have the app running on mobile, test these features:

### UI/UX Testing
- [ ] Page loads correctly
- [ ] All sections are readable (responsive design)
- [ ] Buttons are tappable
- [ ] Navigation works smoothly
- [ ] No horizontal scrolling

### Functionality Testing
- [ ] Tap upload button works
- [ ] File picker opens
- [ ] Can select ZIP files
- [ ] Progress bar displays
- [ ] Processing completes
- [ ] Download button works
- [ ] Can save processed ZIP

### Performance Testing
- [ ] Test with small ZIP (~10 photos)
- [ ] Test with medium ZIP (~50 photos)
- [ ] Check if browser memory is sufficient
- [ ] Verify processing speed

### Browser Testing
Test on multiple mobile browsers:
- [ ] Safari (iOS)
- [ ] Chrome (iOS/Android)
- [ ] Firefox (Android)
- [ ] Samsung Internet (Android)

## Known Mobile Limitations

### iOS Limitations
- **File Access**: Limited to Files app, iCloud, or other connected services
- **Memory**: Large ZIP files (>500MB) may cause crashes
- **Background Processing**: App must stay in foreground during processing

### Android Limitations
- **File Pickers**: Different file managers may have different UIs
- **Memory**: Older devices may struggle with large files
- **Chrome**: Works best, other browsers may have compatibility issues

## Troubleshooting

### Can't Connect to Local Server

1. **Check Firewall**: Make sure port 8000 is not blocked
   ```bash
   # On Linux, allow the port
   sudo ufw allow 8000
   ```

2. **Try Different Port**: Use 8080 or 3000 instead
   ```bash
   python3 -m http.server 8080
   ```

3. **Check Network**: Ensure both devices are on same WiFi (not guest network)

4. **Disable VPN**: VPNs can block local network access

### App Doesn't Load on Mobile

1. **Try HTTPS**: Some features require secure context
2. **Clear Browser Cache**: Old cached files may cause issues
3. **Check Browser Compatibility**: Update to latest version

### File Upload Doesn't Work

1. **Check File Size**: Mobile browsers have memory limits
2. **Try Smaller Files**: Start with a small test ZIP
3. **Use Different Browser**: Try Chrome if Safari fails (or vice versa)

### Processing Takes Too Long

1. **Reduce File Count**: Process in smaller batches
2. **Use Desktop**: Large libraries work better on desktop
3. **Close Other Apps**: Free up memory on mobile device

## Creating Test Files on Mobile

To test the app, you can:

1. **Use the test page**: Access `test.html` and download the sample ZIP
2. **Create on desktop**: Make a test ZIP and transfer via AirDrop/Bluetooth
3. **Use cloud storage**: Download test ZIPs from Google Drive/Dropbox

## Best Practices

1. **Start Small**: Test with 5-10 photos first
2. **Keep Screen On**: Prevent phone from sleeping during processing
3. **Good WiFi**: Use stable connection for initial load
4. **Sufficient Storage**: Make sure you have space for output files
5. **Battery**: Keep phone plugged in for large jobs

## Quick Start Command

Run this on your computer to get started:

```bash
# Get your IP address and start server
echo "Your computer's IP address:"
hostname -I | awk '{print $1}'
echo ""
echo "Starting server on http://0.0.0.0:8000"
echo "Access from mobile at: http://$(hostname -I | awk '{print $1}'):8000"
echo ""
python3 -m http.server 8000
```

Then open the displayed URL on your mobile device!

---

**Need help?** Open an issue on GitHub or check the main README.md for more information.
