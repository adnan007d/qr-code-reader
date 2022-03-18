export type IToBase64Image = (imageFile: File) => Promise<string | null>;
export type IScanQrCode = (imageSource: string) => Promise<string>;
