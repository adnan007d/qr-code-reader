import { ChangeEvent, useState } from "react";
import { Decoder } from "@nuintun/qrcode";
import { IScanQrCode, IToBase64Image } from "./types";

const toBase64DataImage: IToBase64Image = (imageFile: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener("loadend", (e) => {
      if (e.target?.result) resolve(e.target.result.toString());
    });
    fileReader.addEventListener("error", reject);
    fileReader.readAsDataURL(imageFile);
  });
};

const scanQRCode: IScanQrCode = async (imageSource: string) => {
  try {
    const qrcode = new Decoder();

    const result = await qrcode.scan(imageSource);
    return result.data;
  } catch (error) {
    console.log("Failed");
    return "Failed to Decode";
  }
};

function App() {
  const [fileData, setFileData] = useState<string>("");
  const [decodedData, setDecodedData] = useState<string>("");
  const [source, setSource] = useState<string | null>(null);

  const change = async (e: ChangeEvent<HTMLInputElement>) => {
    setSource(null);
    if (e.target.files?.length) {
      const file = e.target.files[0];

      if (file.type.split("/")[0] !== "image")
        return alert("Not an Image file");

      const base64Image = await toBase64DataImage(file);

      console.log(base64Image);
      if (base64Image) {
        setSource(base64Image);
        const d = await scanQRCode(base64Image);
        setDecodedData(d);
        console.log(d);
      }
    }
  };

  return (
    <div>
      <h1>Hello</h1>
      <input
        type="file"
        name="reader"
        id="image"
        value={fileData}
        onChange={change}
      />
      <div>
        {source && (
          <img
            style={{ width: "500px", objectFit: "contain" }}
            src={source}
            alt=""
          />
        )}
      </div>
      <div>
        <span>{decodedData}</span>
      </div>
    </div>
  );
}

export default App;
