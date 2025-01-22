import { POST as P } from "@/lib/cacheKeys";
import CloudinaryService from "@/lib/CloudinaryService";
import PostService from "@/lib/drizzle/services/PostService";
import { getAuth } from "@/lib/next.auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zfd } from "zod-form-data";

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

export const POST = async (request: Request) => {
  const schema = zfd.formData({
    description: zfd.text(z.string().optional()),
    location: zfd.text(z.string().optional()),
    images: zfd
      .file()
      .or(zfd.file().array())
      .transform(async (v) => {
        if (v instanceof File) {
          return [v];
        }
        return v;
      }),
  });

  const formData = await request.formData();
  const { success, data, error } = await schema.safeParseAsync(formData);
  if (!success) {
    const errors = error.flatten().fieldErrors;
    console.log("validation errors : ", errors);

    return NextResponse.json(errors, {
      status: 400,
    });
  }
  const session = await getAuth();
  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized" },
      {
        status: 400,
      },
    );
  }
  const {
    user: { id: userId },
  } = session;
  const urls: PostContentUrl[] = [];
  for (const image of data.images) {
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
    description: data.description,
    location: data.location,
  });

  revalidateTag(P.homePosts);
  revalidateTag(P.userPosts);

  return NextResponse.json(
    { message: "New post created successfully" },
    { status: 201 },
  );
};
