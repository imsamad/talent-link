import crypto from "crypto";

export function generateOTP() {
  const randomBytes = crypto.randomBytes(2); // 2 bytes = 16 bits, suff. for 4-digit number

  // Convert an integer and make sure it is within the 4-digit range
  const otp = randomBytes.readUInt16BE(0) % 10000;

  // Convert to string and pad with leading zeros if required
  const otpString = otp.toString().padStart(4, "0");

  return otpString;
}
