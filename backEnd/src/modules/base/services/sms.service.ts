import axios from "axios";

export const sendSMS = async (OTP: string, mobileNumber: string) => {
  console.log("hi");
  const message = await axios.post(
    "https://api.textit.biz/",
    {
      to: mobileNumber.toString(),
      text: `You requested a password reset. Your OTP is ${OTP}. Use this code to reset your password. It will expire in ${process.env?.OTP_EXPIRES_MINUTE} minutes. - FindMySpot`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "X-API-VERSION": "v1",
        Authorization: `Basic ${process.env?.SMS_API_KEY}`,
      },
    }
  );
  console.log(message);
  return message;
};
