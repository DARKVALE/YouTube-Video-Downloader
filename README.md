# Nebula Commerce Storefront

The repository now ships with a fully responsive multi-page ecommerce demo built with HTML, CSS, and vanilla JavaScript.
Navigate between the home experience, catalog, product detail, cart, account, support, and journal pages to explore
end-to-end storefront flows powered by lightweight client-side data.

## ⚙️ Getting started

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/public/index.html> in your browser.

## 📁 Front-end structure

```
public/
  assets/
    css/
      main.css         # global foundations, layout, typography
      components.css   # component-specific styling for catalog, cart, account, etc.
    js/
      app.js           # global navigation, language picker, newsletter, cart indicator
      home.js          # homepage merchandising
      catalog.js       # filtering, sorting, view switching
      product.js       # product detail experience and related products
      cart.js          # cart management, promo codes, totals
      support.js       # concierge and tracking forms
      account.js       # loyalty, wishlist, saved addresses
      journal.js       # demo messaging for placeholder links
      data/products.js # curated product catalogue
      modules/         # shared helpers for storage, product templates, cart actions
```

The legacy Python-based YouTube downloader is still available below.

# Simple YouTube Downloader

A user-friendly YouTube downloader with a graphical interface. Just paste a URL and download!

## 🚀 Quick Installation Guide for macOS

### One-Time Setup

1. **Install Python**
   Open Terminal (press `Command + Space`, type "Terminal", press Enter) and run:
   ```bash
   brew install python
   ```
   Don't have brew? Install it first:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Download the Project**
   ```bash
   cd ~/Desktop
   git clone https://github.com/yourusername/newyoutube.git
   cd newyoutube
   ```

3. **Install Requirements**
   ```bash
   pip3 install -r requirements.txt
   ```

### 🎵 How to Use

1. **Open Terminal**
   Press `Command + Space`, type "Terminal", press Enter

2. **Go to the Project**
   ```bash
   cd ~/Desktop/newyoutube
   ```

3. **Run the Program**
   ```bash
   python3 src/downloader.py
   ```

4. **Using the Program**
   - Paste your YouTube URL
   - Choose Video or Audio Only
   - Select quality (High or Low)
   - Click Download
   - Wait for completion!

### 📁 Where are my Downloads?

Find your downloads in:
- Videos: `~/Desktop/newyoutube/downloads/video`
- Audio: `~/Desktop/newyoutube/downloads/audio`

### ❓ Common Issues

1. **"No module named 'pytube'"**
   Run:
   ```bash
   pip3 install -r requirements.txt
   ```

2. **"Invalid URL"**
   - Make sure you copied the full YouTube URL
   - URL should start with "https://www.youtube.com/" or "https://youtu.be/"

3. **"Permission denied"**
   Run:
   ```bash
   chmod +x src/downloader.py
   ```

### ✨ Features

- Simple graphical interface
- Video and audio downloads
- Quality options
- Progress bar
- Download status updates
- Organized downloads folder

### 💻 Requirements

- Python 3.8 or higher
- macOS 10.15 or higher
- Internet connection

### 📘 Note

This is a simplified version focused on ease of use. Just run the program and start downloading!

---

Need help? Open an issue on GitHub!
