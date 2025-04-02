// Load environment variables from .env
require('dotenv').config();

const { chromium } = require('playwright');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const os = require('os');

// Parse CLI arguments
const argv = yargs
  .option('headless', {
    type: 'boolean',
    description: 'Run browser in headless mode (default: true)',
    default: true
  })
  .option('cert', {
    type: 'string',
    description: 'Name of the ROS certificate to use'
  })
  .option('password', {
    type: 'string',
    description: 'Password for the ROS certificate'
  })
  .option('noemail', {
    type: 'boolean',
    description: 'Skip email and save output locally',
    default: false
  })
  .help()
  .argv;

// Environment variables
const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;
const CERT_NAME = argv.cert || process.env.ROS_CERT_NAME;
const CERT_PASSWORD = argv.password || process.env.ROS_CERT_PASSWORD;

if (!CERT_NAME || !CERT_PASSWORD) {
  console.error('❌ Certificate name and password are required. Provide them via CLI or .env file.');
  process.exit(1);
}

(async () => {
  // Determine user data directory based on OS
  const userDataDir = os.platform() === 'win32'
    ? path.join(process.env.LOCALAPPDATA, 'Google/Chrome/User Data')
    : path.join(os.homedir(), 'Library/Application Support/Google/Chrome/Default');

  // Determine Chrome executable path
  const chromePath = os.platform() === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: argv.headless,
    executablePath: chromePath,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  console.log('🚀 Launching browser and navigating to ROS...');
  await page.goto('https://www.ros.ie/oidc/login?lang=en&client_id=rosint_rp');

  if (argv.headless) {
    console.log('🔐 Selecting certificate and entering password...');
    await page.selectOption('#certList', CERT_NAME);
    await page.fill('#password', CERT_PASSWORD);
    await page.click('#login');
  } else {
    console.log('🧑‍💻 Please upload your certificate, select it, and click "Login to ROS" manually.');
    if (CERT_PASSWORD) {
      try {
        await page.waitForSelector('#password', { timeout: 10000 });
        await page.fill('#password', CERT_PASSWORD);
        console.log('🔐 Password autofilled in manual mode.');
      } catch (e) {
        console.warn('⚠️ Password field not found in time to autofill.');
      }
    }
    await page.waitForSelector('text="Revenue Record"', { timeout: 0 });
  }

  console.log('🔍 Waiting for Revenue Record tab...');
  await page.click('text="Revenue Record"');

  console.log('🕒 Giving time for inbox content to load...');
  await page.waitForTimeout(10000);

  const debugScreenshot = 'after-click.png';
  await page.screenshot({ path: debugScreenshot });
  console.log(`📸 Debug screenshot saved: ${debugScreenshot}`);

  console.log('📥 Waiting for inbox rows...');
  try {
    await page.waitForSelector('tbody[id$="searchInboxDocs:tb"] tr', { timeout: 60000 });
  } catch (err) {
    console.error('❌ Inbox rows not found:', err);
    const html = await page.content();
    fs.writeFileSync('debug.html', html);
    console.log('📝 Saved page HTML to debug.html');
    await browser.close();
    return;
  }

  const messages = await page.$$eval('tbody[id$="searchInboxDocs:tb"] tr', rows => {
    return rows.map(row => {
      const cells = row.querySelectorAll('td');
      const getText = (td) => td?.innerText?.trim() || '';
      return {
        noticeNo: getText(cells[2]),
        clientName: getText(cells[3]),
        documentId: getText(cells[4]),
        taxType: getText(cells[5]),
        documentType: getText(cells[6]),
        periodBegin: getText(cells[7]),
        issuedDate: getText(cells[8])
      };
    });
  });

  const inboxScreenshot = 'inbox.png';
  await page.screenshot({ path: inboxScreenshot, fullPage: true });

  if (argv.noemail) {
    fs.writeFileSync('inbox_data.json', JSON.stringify(messages, null, 2));
    console.log('📄 Saved inbox data to inbox_data.json');
  } else {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `📨 ROS Inbox Summary – ${new Date().toLocaleDateString()}`,
      text: messages.length ? JSON.stringify(messages, null, 2) : 'No messages found.',
      attachments: [
        { filename: 'inbox.png', path: inboxScreenshot },
        { filename: 'after-click.png', path: debugScreenshot },
        ...(fs.existsSync('debug.html') ? [{ filename: 'debug.html', path: 'debug.html' }] : [])
      ]
    });
    console.log('✅ Email sent with inbox summary!');
  }

  await browser.close();
})();

