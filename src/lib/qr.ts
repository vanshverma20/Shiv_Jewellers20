import QRCode from 'qrcode';
import bwipjs from 'bwip-js';

// Generate a random public ID like JWL-8F4K29X
export function generatePublicId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'JWL-';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate base64 Data URI for QR code
export async function generateProductQRCode(publicId: string): Promise<{ url: string, qrDataUri: string }> {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const productionUrl = 'https://shiv-jewellers20.vercel.app';
  const baseUrl = process.env.NODE_ENV === 'production'
    ? (configuredUrl && !configuredUrl.includes('localhost') ? configuredUrl : productionUrl)
    : (configuredUrl || 'http://localhost:3000');
  const productUrl = `${baseUrl}/scan/${publicId}`;

  try {
    const qrDataUri = await QRCode.toDataURL(productUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return { url: productUrl, qrDataUri };
  } catch (err) {
    console.error('Failed to generate QR code', err);
    throw new Error('QR Generation failed');
  }
}

// Generate base64 Data URI for 1D Barcode (Code-128)
export async function generateProductBarcode(publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: 'code128',
      text: publicId,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    }, (err, png) => {
      if (err) {
        console.error('Failed to generate barcode', err);
        return reject(new Error('Barcode Generation failed'));
      }
      resolve(`data:image/png;base64,${png.toString('base64')}`);
    });
  });
}

