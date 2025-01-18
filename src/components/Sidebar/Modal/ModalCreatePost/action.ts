"use server";

import { POST } from "@/lib/cacheKeys";
import CloudinaryService from "@/lib/CloudinaryService";
import PostService from "@/lib/drizzle/services/PostService";
import { authClient } from "@/lib/next-safe-action/init";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  images: zfd
    .file()
    .or(zfd.file().array())
    .transform((v) => {
      if (v instanceof File) {
        return [v];
      }
      return v;
    }),
  description: zfd.text(z.string().optional()),
  location: zfd.text(z.string().optional()),
});

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

export const createPost = authClient
  .schema(schema)
  .action(
    async ({
      ctx: { userId },
      parsedInput: { description, images, location },
    }) => {
      const urls: PostContentUrl[] = [];

      for (const image of images) {
        const response = await CloudinaryService.upload(image);
        urls.push({
          publicId: response.public_id,
          type: response.resource_type === "image" ? "image" : "video",
          url: response.secure_url,
        });
      }

      const postService = new PostService();
      await postService.create({
        urls,
        userId,
        description,
        location,
      });

      revalidateTag(POST.homePosts);
      revalidateTag(POST.userPosts);

      return "New post added";
    },
  );
