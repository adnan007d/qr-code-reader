export type IResponse = { error: boolean; data: string };

export type IToBase64Image = (imageFile: File) => Promise<IResponse>;
export type IScanQrCode = (imageSource: string) => Promise<IResponse>;
