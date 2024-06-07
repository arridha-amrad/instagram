"use server";

import { upload } from "@/lib/cloudinary";
import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

export const createPostAction = async (prevState: any, formData: FormData) => {
  const images = formData.getAll("images") as File[];
  const description = formData.get("description") as string | null;
  const location = formData.get("location") as string | null;
  const userId = formData.get("userId") as string;

  // const responses: UploadApiResponse[] = [];
  const urls: PostContentUrl[] = [];
  for (const image of images) {
    const response = await upload(image);
    urls.push({
      publicId: response.public_id,
      type: response.resource_type === "image" ? "image" : "video",
      url: response.secure_url,
    });
  }

  try {
    await db.transaction(async (tx) => {
      await tx.insert(PostsTable).values({
        userId,
        description,
        location,
        urls,
      });
    });
    return {
      data: "ok",
      type: "success",
      message: "New post created successfully",
    };
  } catch (err) {
    console.log({ err });
    return {
      data: "ok",
      type: "error",
      message: "Something went wrong",
    };
  }
};
