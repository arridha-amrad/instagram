import { TransformationOptions, UploadApiResponse, v2 } from "cloudinary";

export default class CloudinaryService {
  private static readonly cloudinary = v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  private constructor() {}

  private static defaultTransformation: TransformationOptions = [
    { quality: 90 },
    { if: "width > 1000" },
    { width: 1000, crop: "scale" },
    { if: "end" },
  ];

  private static avatarTransformation: TransformationOptions = [
    { quality: 90 },
    { width: 250, height: 250, crop: "thumb" },
  ];

  public async remove(publicId: string) {
    await CloudinaryService.cloudinary.uploader.destroy(publicId);
  }

  public static async upload(file: File, isAvatar?: boolean) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const data = await new Promise((resolve, reject) => {
      CloudinaryService.cloudinary.uploader
        .upload_stream(
          {
            folder: "instagram",
            transformation: isAvatar
              ? this.avatarTransformation
              : this.defaultTransformation,
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
}
