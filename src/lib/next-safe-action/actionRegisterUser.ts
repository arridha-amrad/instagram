"use server";

import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { registerUser } from "../drizzle/mutations/registerUser";
import { optionalAuthClient } from "./init";

const registrationSchema = zfd.formData({
  name: zfd.text(
    z
      .string()
      .min(1, { message: "name is required" })
      .min(5, { message: "name is too short" }),
  ),
  email: zfd.text(z.string().email()),
  username: zfd.text(
    z
      .string()
      .min(1, { message: "username is required" })
      .min(5, { message: "username is too short" }),
  ),
  password: zfd.text(
    z
      .string()
      .min(1, { message: "password is required" })
      .min(5, { message: "password is too short" }),
  ),
});

export const actionRegister = optionalAuthClient
  .schema(registrationSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, name, password, username } }) => {
    try {
      await registerUser({
        email,
        name,
        password,
        username,
      });
    } catch (err) {
      throw err;
    }
  });
