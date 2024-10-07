import { upload } from "@/lib/cloudinary";
import db from "../db";
import { PostsTable } from "../schema";

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

type Param = {
  images: File[] | File;
  description?: string;
  location?: string;
  authUserId: string;
};

export const createPost = async ({
  authUserId,
  description,
  images,
  location,
}: Param) => {
  //
  const urls: PostContentUrl[] = [];
  if (images instanceof Array) {
    for (const image of images) {
      const response = await upload(image);
      urls.push({
        publicId: response.public_id,
        type: response.resource_type === "image" ? "image" : "video",
        url: response.secure_url,
      });
    }
  } else {
    const response = await upload(images);
    urls.push({
      publicId: response.public_id,
      type: response.resource_type === "image" ? "image" : "video",
      url: response.secure_url,
    });
  }

  const [response] = await db
    .insert(PostsTable)
    .values({
      userId: authUserId,
      description,
      location,
      urls,
    })
    .returning();

  return response;
};
