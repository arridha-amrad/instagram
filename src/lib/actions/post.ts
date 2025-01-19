"use server";

import { z } from "zod";
import { authActionClient } from "../safeAction";
import { redirect } from "next/navigation";
import PostService from "../drizzle/services/PostService";
import CloudinaryService from "../CloudinaryService";
import { zfd } from "zod-form-data";
import { POST } from "../cacheKeys";
import { revalidateTag } from "next/cache";

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

export const createPost = authActionClient
  .schema(schema)
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(
    async ({
      ctx: { session },
      parsedInput: { description, images, location },
      bindArgsParsedInputs: [pathname],
    }) => {
      if (!session) {
        return redirect(`/login?cb_url?${pathname}`);
      }

      const { id: userId } = session.user;

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

export const likePost = authActionClient
  .schema(
    z.object({
      pathname: z.string(),
      postId: z.string(),
    }),
  )
  .action(async ({ ctx: { session }, parsedInput: { pathname, postId } }) => {
    if (!session) {
      return redirect(`/login?cb_url=${pathname}`);
    }
    const { id: userId } = session.user;

    const postService = new PostService();

    const likeRows = await postService.findLike({ postId, userId });
    let message = "";
    if (likeRows.length === 0) {
      await postService.like({ postId, userId });
      message = "like";
    } else {
      await postService.dislike({ postId, userId });
      message = "dislike";
    }
    return message;
  });
