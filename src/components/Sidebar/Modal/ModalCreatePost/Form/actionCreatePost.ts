"use server";

import { upload } from "@/lib/cloudinary";
import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

const schema = zfd.formData({
  images: zfd.file().array(),
  description: zfd.text(z.string().optional()),
  location: zfd.text(z.string().optional()),
});

export const createPostAction = actionClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[userId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [userId],
      parsedInput: { description, images, location },
    }) => {
      if (userId === "") {
        redirect("/login");
      }
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
        const [response] = await db
          .insert(PostsTable)
          .values({
            userId,
            description,
            location,
            urls,
          })
          .returning();

        revalidatePath("/");

        return {
          data: response,
          message: "New post added",
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  );
