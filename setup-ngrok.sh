#!/bin/bash

# Ngrok Setup Script for Metadata Fixer

echo "====================================="
echo "🚀 Setting up Ngrok for Mobile Testing"
echo "====================================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 Ngrok not found. Installing..."
    echo ""

    # Detect OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Installing for Linux..."
        wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
        tar -xvzf ngrok-v3-stable-linux-amd64.tgz
        sudo mv ngrok /usr/local/bin/
        rm ngrok-v3-stable-linux-amd64.tgz
        echo "✅ Ngrok installed!"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Installing for Mac..."
        if command -v brew &> /dev/null; then
            brew install ngrok/ngrok/ngrok
            echo "✅ Ngrok installed!"
        else
            echo "❌ Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install ngrok manually from: https://ngrok.com/download"
        exit 1
    fi
    echo ""
fi

# Check if server is running
if ! lsof -i:8000 &> /dev/null; then
    echo "⚠️  No server detected on port 8000"
    echo "Starting server..."
    cd "$(dirname "$0")"
    python3 -m http.server 8000 &
    SERVER_PID=$!
    echo "✅ Server started (PID: $SERVER_PID)"
    sleep 2
fi

echo ""
echo "====================================="
echo "🌐 Starting Ngrok Tunnel..."
echo "====================================="
echo ""
echo "⏳ Creating secure tunnel to localhost:8000..."
echo ""

# Start ngrok
ngrok http 8000
