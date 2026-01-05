#!/bin/bash

# Metadata Fixer - Mobile Testing Server Startup Script

echo "=================================="
echo "Metadata Fixer Mobile Test Server"
echo "=================================="
echo ""

# Get IP address
IP=$(hostname -I | awk '{print $1}')

if [ -z "$IP" ]; then
    echo "❌ Could not detect IP address"
    echo "Please run 'ifconfig' or 'ip addr' to find your local IP"
    exit 1
fi

echo "✅ Server starting..."
echo ""
echo "📱 MOBILE ACCESS INSTRUCTIONS:"
echo "=================================="
echo ""
echo "1. Make sure your mobile device is on the SAME WiFi network"
echo ""
echo "2. Open a browser on your mobile (Chrome/Safari/Firefox)"
echo ""
echo "3. Enter this URL:"
echo ""
echo "   🔗 http://$IP:8000"
echo ""
echo "=================================="
echo ""
echo "📊 Server running at:"
echo "   - Local:   http://localhost:8000"
echo "   - Network: http://$IP:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "=================================="
echo ""

# Start the server
cd "$(dirname "$0")"
python3 -m http.server 8000
