import { AesCipher } from 'aes256';

const key = process.env.REACT_APP_E2E_KEY;
const iv = process.env.REACT_APP_E2E_IV;

if (!key ||!iv) throw Error('Missing environment variables');

// Encryption function
const encryptData = (key, iv, plaintext) => {
  const cipher = new AesCipher(key, iv);
  const ciphertext = cipher.encrypt(plaintext);
  return ciphertext;
};

// Decryption function
const decryptData = (key, iv, ciphertext) => {
  const cipher = new AesCipher(key, iv);
  const plaintext = cipher.decrypt(ciphertext);
  return plaintext;
};

export { encryptData, decryptData };