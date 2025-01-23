import config from "@/config.env";
import {
  TransformationOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});

const defaultTransformation: TransformationOptions = [
  { quality: 90 },
  { if: "width > 1000" },
  { width: 1000, crop: "scale" },
  { if: "end" },
];

const avatarTransformation: TransformationOptions = [
  { quality: 90 },
  { width: 250, height: 250, crop: "thumb" },
];

export async function removeFileFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export async function uploadFileToCloudinary(file: File, isAvatar?: boolean) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const data = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "instagram",
          transformation: isAvatar
            ? avatarTransformation
            : defaultTransformation,
        },
        (err: any, result: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        },
      )
      .end(buffer);
  });
  return data as UploadApiResponse;
}
