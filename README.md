# ROS Inbox Scraper

A script to automate login to ROS (Revenue Online Service), navigate to the inbox, and extract messages. Captured data is sent via email or saved locally depending on the configuration.

## 🚀 Features

- Supports headless and non-headless (manual) modes
- Automatically selects certificate and fills password if provided
- Scrapes inbox message table from the 'Revenue Record' tab
- Saves screenshots and debug HTML for troubleshooting
- Sends inbox data via email or saves it to a local file

## 🛠️ Requirements

- Node.js v18+
- Google Chrome installed
- Gmail account (for email functionality)

## 📦 Installation

```bash
git clone https://github.com/yourusername/ros-inbox-scraper.git
cd ros-inbox-scraper
npm install
```

## 📁 Environment Configuration

Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
EMAIL_TO=recipient@example.com
EMAIL_FROM=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
ROS_CERT_NAME=your_cert_name
ROS_CERT_PASSWORD=your_cert_password
```

## 🧪 Usage

Run the script:

```bash
node index.js
```

### CLI Options:

- `--headless`: Run in headless mode (default: `true`)
- `--cert`: Specify certificate name (overrides `.env`)
- `--password`: Specify certificate password (overrides `.env`)
- `--noemail`: Skip email and save data locally

### 📌 First Time Setup

> ℹ️ For the first time, you **must run with `--headless=false`** so that you can upload and select the ROS certificate manually, then click the **"Login to ROS"** button yourself.

```bash
node index.js --headless=false
```

Once logged in manually and certificate is accepted, future runs can be done headlessly.

## 🔐 Setting Up Gmail App Password

If you're using Gmail to send the ROS inbox summaries via email, you’ll need to create an **App Password** instead of using your regular Gmail password. Here’s how to generate one:

### 📌 Steps to generate Gmail App Password

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to your [Google Account Security page](https://myaccount.google.com/security).
   - Under **"Signing in to Google"**, click **"2-Step Verification"** and follow the instructions to enable it.

2. **Generate an App Password**:
   - Once 2FA is enabled, return to the [Google Security page](https://myaccount.google.com/security).
   - Click on **"App passwords"**.
   - Sign in again if prompted.
   - Under **Select app**, choose **"Mail"**.
   - Under **Select device**, choose **"Other"** and give it a name like `"ROS Script"`.
   - Click **Generate**.

3. **Copy the 16-character password** shown and paste it into your `.env` file as the value for `EMAIL_PASS`.

```env
EMAIL_FROM=your_email@gmail.com
EMAIL_PASS=your_generated_app_password
```

> ⚠️ **Keep this password secure**. Do not share or commit it to source control.

## 📤 Committing & Pushing Changes

```bash
git add .
git commit -m "Your message"
git push origin main
```

## 🧹 .gitignore

Ensure `.env`, screenshots, and debug files are excluded:

```gitignore
.env
inbox.png
after-click.png
debug.html
inbox_data.json
node_modules/
```

## 📝 License

MIT License. Feel free to fork and improve!
