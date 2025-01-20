"use server";

import { actionClient } from "@/lib/safeAction";
import { zfd } from "zod-form-data";

export const test = actionClient.schema(zfd.formData({})).action(async () => {
  console.log("Hello World");
});
