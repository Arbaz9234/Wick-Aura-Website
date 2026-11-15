import bcrypt from "bcrypt";

export const generateOTP = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export const hashOTP = (otp) => bcrypt.hash(otp, 6);

export const verifyOTP = (otp, hash) => bcrypt.compare(otp, hash);
