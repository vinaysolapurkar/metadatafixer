# Easy Mobile Access Guide

Choose the method that works best for you:

## 🟢 Method 1: Local WiFi (RECOMMENDED - No Setup!)

**Your server is already running!**

### Steps:
1. **On your mobile device**, connect to the **same WiFi** as your computer
2. **Open a browser** (Chrome, Safari, Firefox)
3. **Type this URL:**
   ```
   http://21.0.0.124:8000
   ```
4. **Tap on** `quick-start.html` or `index.html`

### Troubleshooting Local WiFi:
- Make sure both devices are on the **same network** (not guest WiFi)
- Try turning off VPN if you have one
- If firewall blocks it, allow port 8000:
  ```bash
  sudo ufw allow 8000
  ```

---

## 🟡 Method 2: GitHub Pages (Best for Permanent Access)

**Deploy once, access forever from anywhere!**

### Steps:
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Source", select branch: `claude/metadatafixer-clone-Z9ert`
4. Click **Save**
5. Wait 2-3 minutes for deployment
6. Access at: `https://YOUR-USERNAME.github.io/metadatafixer/`

**Pros:**
- ✅ Works from anywhere
- ✅ No server needed
- ✅ Share with anyone
- ✅ Always available

---

## 🟠 Method 3: Ngrok (For Testing from Different Networks)

**Use this if local WiFi doesn't work or you're on different networks**

### Setup (One-time):

#### Option A: Quick Install
```bash
cd /home/user/metadatafixer
./setup-ngrok.sh
```

#### Option B: Manual Install

**Linux:**
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

**Mac:**
```bash
brew install ngrok/ngrok/ngrok
```

**Windows:**
Download from: https://ngrok.com/download

### Sign Up (Free - Required for ngrok):
1. Go to https://ngrok.com/signup
2. Create free account
3. Get your auth token from dashboard
4. Run: `ngrok config add-authtoken YOUR_TOKEN`

### Start Tunnel:
```bash
# Server is already running, just start ngrok
ngrok http 8000
```

You'll see something like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:8000
```

**Use the https URL on your mobile device!**

### Stop Tunnel:
Press `Ctrl+C`

---

## 🔵 Method 4: Localhost.run (No Installation!)

**Fastest way to get a public URL without installing anything!**

```bash
# In a new terminal (server is already running)
ssh -R 80:localhost:8000 nokey@localhost.run
```

You'll get a URL like:
```
https://abc123.lhr.life
```

**Use this URL on your mobile device!**

**Pros:**
- ✅ No installation
- ✅ No sign-up
- ✅ Works immediately
- ⚠️ URL changes each time

---

## 🟣 Method 5: Cloudflare Tunnel (Professional Option)

**Best for long-term testing**

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared

# Create tunnel
cloudflared tunnel --url http://localhost:8000
```

Gets you a `*.trycloudflare.com` URL that works on mobile.

---

## 📊 Comparison

| Method | Setup Time | Permanence | Works Offline | Best For |
|--------|-----------|------------|---------------|----------|
| Local WiFi | 0 min | Temporary | Yes | Quick testing |
| GitHub Pages | 5 min | Permanent | No | Production |
| Ngrok | 5 min | Temporary | No | Testing |
| localhost.run | 0 min | Temporary | No | Quick sharing |
| Cloudflare | 3 min | Temporary | No | Professional |

---

## 🎯 My Recommendation

1. **For quick testing NOW**: Use **Local WiFi** (http://21.0.0.124:8000)
2. **For permanent access**: Use **GitHub Pages**
3. **If WiFi doesn't work**: Use **localhost.run** (no installation!)

---

## ⚡ Quick Commands

```bash
# Check if server is running
lsof -i:8000

# Start server if not running
cd /home/user/metadatafixer
python3 -m http.server 8000

# Get your local IP
hostname -I | awk '{print $1}'

# Quick tunnel (no installation)
ssh -R 80:localhost:8000 nokey@localhost.run
```

---

## 🆘 Still Having Issues?

### Can't access via local IP?
- Check firewall: `sudo ufw status`
- Allow port: `sudo ufw allow 8000`
- Disable VPN temporarily

### Ngrok says "offline"?
- You need to actually run `ngrok http 8000`
- Make sure you added auth token first
- Server must be running on port 8000

### GitHub Pages not working?
- Wait 2-3 minutes after enabling
- Check branch name is correct
- Make sure `index.html` exists in root

---

**Need more help?** Check MOBILE_TESTING.md for detailed troubleshooting!
