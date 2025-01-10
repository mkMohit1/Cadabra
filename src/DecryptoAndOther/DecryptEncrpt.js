import CryptoJS from 'crypto-js';

const secretKey = CryptoJS.enc.Hex.parse('3630cc196d7957ab449d38ba7813eccad97111be05b421c524b23c84724687e4'); // Replace with your actual key

export const decryptData = (encryptedData, iv) => {
  try {
    const ivHex = CryptoJS.enc.Hex.parse(iv);
    const encryptedHex = CryptoJS.enc.Hex.parse(encryptedData);
    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedHex); // Convert Hex to Base64

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, secretKey, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) throw new Error('Decryption failed: empty result.');
    return JSON.parse(decryptedString); // Assuming the data is JSON
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};