import { Decoder } from "@nuintun/qrcode";
import { IScanQrCode, IToBase64Image } from "../types";
export const toBase64DataImage: IToBase64Image = (imageFile: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener("loadend", (e) => {
      if (e.target?.result)
        resolve({ error: false, data: e.target.result.toString() });
    });
    fileReader.addEventListener("error", (e) =>
      reject({ error: true, data: "Failed to load Image" })
    );
    fileReader.readAsDataURL(imageFile);
  });
};

export const scanQRCode: IScanQrCode = async (imageSource: string) => {
  try {
    const qrcode = new Decoder();

    const result = await qrcode.scan(imageSource);
    return { error: false, data: result.data };
  } catch (error) {
    console.log("Failed");
    return { error: true, data: "Failed to Decode" };
  }
};
