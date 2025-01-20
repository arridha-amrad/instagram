"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { POST } from "../cacheKeys";
import CloudinaryService from "../CloudinaryService";
import { fetchFeedPosts } from "../drizzle/queries/posts/fetchFeedPosts";
import { fetchPostLikes } from "../drizzle/queries/posts/fetchPostLikes";
import { fetchUserPosts } from "../drizzle/queries/posts/fetchUserPosts";
import PostService from "../drizzle/services/PostService";
import { authActionClient } from "../safeAction";

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

export const createPost = authActionClient
  .schema(
    zfd.formData({
      images: zfd
        .file()
        .or(zfd.file().array())
        .transform(async (v) => {
          if (v instanceof File) {
            return [v];
          }
          return v;
        }),
      description: zfd.text(z.string().optional()),
      location: zfd.text(z.string().optional()),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(
    async ({
      ctx: { session },
      parsedInput: { description, images, location },
    }) => {
      const { id: userId } = session.user;
      const urls: PostContentUrl[] = [];
      try {
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
      } catch (err) {
        console.log(err);

        throw err;
      }
    },
  );

export const likePost = authActionClient
  .schema(
    z.object({
      postId: z.string(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { postId } }) => {
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

export const loadMoreFeedPosts = authActionClient
  .schema(
    z.object({
      page: z.number(),
      date: z.date(),
      total: z.number(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { date, page, total } }) => {
    const result = await fetchFeedPosts({
      page,
      userId: session.user.id,
      date,
      total,
    });
    return result;
  });

export const loadMoreLovers = authActionClient
  .schema(
    z.object({
      postId: z.string(),
      page: z.number().optional(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { postId, page } }) => {
    const result = await fetchPostLikes({
      postId,
      authUserId: session.user.id,
      page,
    });
    return result;
  });

export const loadMoreUserPosts = authActionClient
  .schema(
    z.object({
      username: z.string(),
      date: z.date(),
      total: z.number(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ parsedInput: { date, total, username } }) => {
    const result = await fetchUserPosts({
      username,
      date,
      total,
    });
    return result;
  });
