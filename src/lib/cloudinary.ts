import {
  TransformationOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const defaultTransformation: TransformationOptions = [
  { quality: 80 },
  { if: "width > 600" },
  { width: 600, crop: "scale" },
  { if: "end" },
];

const avatarTransformation: TransformationOptions = [
  { quality: 80 },
  { gravity: "face", width: 250, height: 250, crop: "thumb" },
  { radius: "max" },
];

export const upload = async (file: File, isAvatar?: boolean) => {
  const arraBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arraBuffer);
  const data = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "instagram",
          transformation: isAvatar
            ? avatarTransformation
            : defaultTransformation,
        },
        (err, result) => {
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
};

export const remove = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
  console.log("removed : ", publicId);
};
