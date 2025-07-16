import { useState, useEffect, useCallback } from 'react';

// Base32 decoding, as it's common for TOTP secrets
const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const decodeBase32 = (input: string): Uint8Array => {
  // Remove padding and whitespace, and convert to uppercase
  const sanitizedInput = input.replace(/=/g, '').replace(/\s/g, '').toUpperCase();
  if (sanitizedInput.length === 0) {
      return new Uint8Array(0);
  }

  const buffer = new Uint8Array(Math.floor(sanitizedInput.length * 5 / 8));
  let bufferLength = 0;
  let bits = 0;
  let bitLength = 0;

  for (let i = 0; i < sanitizedInput.length; i++) {
    const char = sanitizedInput[i];
    const value = base32Chars.indexOf(char);
    if (value === -1) {
      throw new Error(`Invalid base32 character: ${char}`);
    }

    bits = (bits << 5) | value;
    bitLength += 5;
    if (bitLength >= 8) {
      buffer[bufferLength++] = (bits >>> (bitLength - 8)) & 0xFF;
      bitLength -= 8;
    }
  }
  return buffer;
};

// Real TOTP generation using Web Crypto API
async function generateOtp(base32Secret: string): Promise<string> {
    if (!base32Secret) return '------';

    try {
        const secretBytes = decodeBase32(base32Secret);
        if (secretBytes.length === 0) return 'Invalid';

        const timeStep = 30; // seconds
        const counter = Math.floor(Date.now() / 1000 / timeStep);

        const counterBuffer = new ArrayBuffer(8);
        const counterView = new DataView(counterBuffer);
        
        // The spec requires a 64-bit counter. JavaScript numbers are safe up to 2^53.
        // We write the counter as a 64-bit big-endian integer.
        const high = Math.floor(counter / 0x100000000);
        const low = counter % 0x100000000;
        counterView.setUint32(0, high, false); // Big-endian
        counterView.setUint32(4, low, false);  // Big-endian

        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            secretBytes,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );

        const signature = await window.crypto.subtle.sign(
            'HMAC',
            cryptoKey,
            counterBuffer
        );
        
        // Dynamic Truncation
        const dataView = new DataView(signature);
        const offset = dataView.getUint8(dataView.byteLength - 1) & 0x0f;
        const truncatedHash = dataView.getInt32(offset, false) & 0x7fffffff;
        
        const otp = (truncatedHash % 1000000).toString().padStart(6, '0');

        return otp;
    } catch (error) {
        console.error('Error generating OTP:', error);
        return 'Invalid'; 
    }
}


export const useOtp = (secret: string) => {
  const [otp, setOtp] = useState('------');
  const [time, setTime] = useState(Date.now());

  // timeWindow is the value that changes every 30s and triggers OTP re-generation.
  const timeWindow = Math.floor(Date.now() / 30000);

  const updateOtp = useCallback(async () => {
    const newOtp = await generateOtp(secret);
    setOtp(newOtp);
  }, [secret]);

  // This effect updates the OTP when the time window changes or the secret changes.
  useEffect(() => {
    updateOtp();
  }, [timeWindow, updateOtp]);

  // This effect only runs the timer to update the progress bar every second.
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(Date.now());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const remainingSeconds = 30 - (Math.floor(time / 1000) % 30);
  const progress = remainingSeconds / 30;

  return { otp, progress };
};
