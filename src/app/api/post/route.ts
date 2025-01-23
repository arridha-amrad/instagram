import { uploadFileToCloudinary } from "@/lib/fileUploadHandler";
import PostService from "@/lib/drizzle/services/PostService";
import { getAuth } from "@/lib/next.auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { FeedPost } from "@/app/(auth)/(home)/Post/store";

export const POST = async (request: Request) => {
  const session = await getAuth();
  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized" },
      {
        status: 400,
      },
    );
  }

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

  const {
    user: { id: userId, image, username },
  } = session;

  const promises = data.images.map(async (image) => {
    const { secure_url, public_id, resource_type } =
      await uploadFileToCloudinary(image);
    return {
      url: secure_url,
      publicId: public_id,
      type: resource_type as "image" | "video",
    };
  });

  const urls = await Promise.all(promises);

  const postService = new PostService();
  const [post] = await postService.create({
    urls,
    userId,
    description: data.description,
    location: data.location,
  });

  const newPost: FeedPost = {
    ...post,
    avatar: image,
    isLiked: false,
    sumComments: 0,
    sumLikes: 0,
    username,
    comments: [],
  };

  return NextResponse.json(
    { message: "New post created successfully", post: newPost },
    { status: 201 },
  );
};
