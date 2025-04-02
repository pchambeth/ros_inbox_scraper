# ROS Inbox Scraper

This Playwright-based script logs into [ROS.ie](https://www.ros.ie), scrapes inbox messages under the "Revenue Record" tab, and either sends them via email or saves them locally.

## 📦 Features

- Supports **headless and non-headless** modes.
- Autofills password if provided.
- Allows **manual certificate upload** in non-headless mode.
- Saves screenshots and scraped data.
- Emails the inbox summary with attachments.
- Secure credential handling via `.env`.

## 🛠 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pchambeth/ros-inbox-scraper.git
   cd ros-inbox-scraper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create your `.env` file**:
   ```bash
   cp .env.example .env
   # Then edit the `.env` file to match your config
   ```

## 🚀 Usage

### Headless (automated login):
```bash
node index.js
```

### Non-headless (manual cert upload):
```bash
node index.js --headless=false
```

### Override cert details (optional):
```bash
node index.js --cert=myCert --password=myPassword
```

### Skip email and save locally:
```bash
node index.js --noemail
```

## 💽 Compatible Platforms

- ✅ MacOS (default Chrome path configured)
- ✅ Windows (auto-detected Chrome path)

Ensure Chrome is installed and your certificate is loaded.

## 🛡 Security

Keep your `.env` file safe. It contains sensitive credentials.

## 🧹 License

MIT
