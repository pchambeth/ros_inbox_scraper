# ROS Inbox Scraper

A Playwright-based automation script that logs into the Revenue Online Service (ROS) portal, reads new messages from the Revenue Record tab, captures screenshots, and sends the data via email or saves it locally.

---

## ⚙️ Features

- Supports headless and non-headless (visible browser) modes
- Autofills password for ROS certificate
- Allows user to upload/select certificate manually in interactive mode
- Saves data as local file or sends it via email (Gmail)
- Screenshots captured for debugging and inbox overview

---

## 🛠️ Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/pchambeth/ros-inbox-scraper.git
   cd ros-inbox-scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in the required environment variables:
   ```bash
   cp .env.example .env
   ```

4. Make sure you have Google Chrome installed.

---

## 📦 Environment Variables

Create a `.env` file with the following:
```env
EMAIL_TO=recipient@example.com
EMAIL_FROM=yourgmail@example.com
EMAIL_PASS=your_gmail_app_password
ROS_CERT_NAME=Capisso
ROS_CERT_PASSWORD=your_cert_password
```

---

## 🚀 First-Time Setup

Before you can run this script in fully automated mode, you **must run it once with the browser visible** to upload your ROS certificate manually.

### ✅ Steps:

1. Run the script with `--headless=false`:
   ```bash
   node index.js --headless=false
   ```
2. In the browser window that opens:
   - Upload your ROS digital certificate if it's not already loaded.
   - Select the appropriate certificate from the dropdown.
   - If a password is provided (via `.env` or `--password`), it will be auto-filled.
   - Manually click the **"Login to ROS"** button.

3. After successful login, the certificate will remain loaded in the browser profile.

Once this is done, you can run the script in headless mode from then on:
```bash
node index.js
```

---

## 🚦 Usage

```bash
node index.js [--headless=false] [--cert=name] [--password=pass] [--noemail]
```

### Options
- `--headless=false`: Run in visible mode (useful for uploading certificate)
- `--cert`: Certificate name (overrides `.env`)
- `--password`: Certificate password (overrides `.env`)
- `--noemail`: Skip email, save data to local `inbox_data.json`

---

## 🗂️ Output
- `inbox.png`: Screenshot of the inbox
- `after-click.png`: Screenshot after login
- `debug.html`: Optional HTML dump if scraping fails
- `inbox_data.json`: Inbox data if `--noemail` is used

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

---

## 🙌 Credits
Built with ❤️ using [Playwright](https://playwright.dev/), [Node.js](https://nodejs.org/), and [Nodemailer](https://nodemailer.com/).
