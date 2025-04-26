import inquirer from 'inquirer';
import QRCode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helpers to work with __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sanitizeFileName(input) {
  return input.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'qrcode';
}

async function main() {
  try {
    const { data, errorCorrectionLevel, colorDark, colorLight, preview } = await inquirer.prompt([
      {
        type: 'input',
        name: 'data',
        message: 'Enter text or URL for the QR Code:',
        validate: input => input.trim() !== '' || 'Input cannot be empty!',
      },
      {
        type: 'list',
        name: 'errorCorrectionLevel',
        message: 'Choose error correction level:',
        choices: ['L', 'M', 'Q', 'H'],
        default: 'M',
      },
      {
        type: 'input',
        name: 'colorDark',
        message: 'Enter foreground color (hex or name):',
        default: '#000000',
      },
      {
        type: 'input',
        name: 'colorLight',
        message: 'Enter background color (hex or name):',
        default: '#FFFFFF',
      },
      {
        type: 'confirm',
        name: 'preview',
        message: 'Preview QR code in terminal?',
        default: false,
      },
    ]);

    if (preview) {
      qrcodeTerminal.generate(data, { small: true });
    }

    const fileName = sanitizeFileName(data);
    const filePath = path.join(__dirname, `${fileName}.png`);

    await QRCode.toFile(filePath, data, {
      errorCorrectionLevel,
      color: {
        dark: colorDark,
        light: colorLight,
      },
    });

    console.log(`✅ QR Code saved as: ${fileName}.png`);
  } catch (err) {
    console.error('❌ Error generating QR Code:', err.message);
  }
}

main();
