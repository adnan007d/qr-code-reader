import { ChangeEvent, ReactElement, useRef, useState } from "react";
import { scanQRCode, toBase64DataImage } from "../../utility/decode";
import DuplicateIcon from "@heroicons/react/outline/DuplicateIcon";

const Result = (decodedData: string, error: boolean = false): ReactElement => {
  return (
    <div
      className={`bg-[#696969] text-center mx-2 px-2 rounded-md py-2 flex items-center space-x-3 w-fit ${
        error && "bg-red-600"
      } `}
      style={{ maxWidth: "90%" }}
    >
      <span className="overflow-hidden text-ellipsis flex-1">
        {decodedData}
      </span>
      {!error && (
        <DuplicateIcon
          className="w-8 h-8 px-1 rounded-md hover:bg-[#3f3939] active:bg-[#394141] cursor-pointer"
          onClick={(e) => navigator.clipboard.writeText(decodedData)}
        />
      )}
    </div>
  );
};

const index = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [decodedData, setDecodedData] = useState<string>("");
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const change = async (e: ChangeEvent<HTMLInputElement>) => {
    setSource(null);
    setDecodedData("");
    setError(null);
    if (e.target.files?.length) {
      const file = e.target.files[0];

      if (file.type.split("/")[0] !== "image")
        return setError("Not an Image File");

      const base64Image = await toBase64DataImage(file);

      if (!base64Image.error) {
        setSource(base64Image.data);
        const { error, data } = await scanQRCode(base64Image.data);
        if (error) setError(data);
        else setDecodedData(data);
      } else setError(base64Image.data);
    }
  };

  return (
    <div className="mt-4 flex flex-col justify-center items-center w-full space-y-4">
      <button
        className="bg-[#1c1d1e] rounded-md px-4 py-2"
        onClick={(e) => fileInputRef.current?.click()}
      >
        Upload
      </button>
      <input
        className="hidden"
        type="file"
        name="reader"
        // onDrag={(e)=>e.target.}
        id="image"
        onChange={change}
        ref={fileInputRef}
      />
      <div>
        {source && (
          <img
            className="w-96 h-96 object-contain bg-[#1e1e1e]"
            src={source}
            alt=""
          />
        )}
      </div>
      {error && Result(error, true)}
      {decodedData && Result(decodedData)}
    </div>
  );
};

export default index;
