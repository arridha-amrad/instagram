import envSchema, { JSONSchemaType } from "env-schema";

type Env = {
  AUTH_GITHUB_ID: string;
  AUTH_GITHUB_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  AUTH_SECRET: string;
  BASE_URL: string;
  CLOUDINARY_KEY: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_SECRET: string;
  DB_URL: string;
  GOOGLE_REFRESH_TOKEN: string;
  GOOGLE_USER: string;
  TOKEN_SECRET_KEY: string;
};

const schema: JSONSchemaType<Env> = {
  type: "object",
  required: [
    "AUTH_GITHUB_ID",
    "AUTH_GITHUB_SECRET",
    "AUTH_GOOGLE_ID",
    "AUTH_GOOGLE_SECRET",
    "AUTH_SECRET",
    "BASE_URL",
    "CLOUDINARY_KEY",
    "CLOUDINARY_NAME",
    "CLOUDINARY_SECRET",
    "DB_URL",
    "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_USER",
    "TOKEN_SECRET_KEY",
  ],
  properties: {
    AUTH_GITHUB_ID: {
      type: "string",
    },
    AUTH_GITHUB_SECRET: {
      type: "string",
    },
    AUTH_GOOGLE_ID: {
      type: "string",
    },
    AUTH_GOOGLE_SECRET: {
      type: "string",
    },
    BASE_URL: {
      type: "string",
    },
    CLOUDINARY_KEY: {
      type: "string",
    },
    CLOUDINARY_NAME: {
      type: "string",
    },
    CLOUDINARY_SECRET: {
      type: "string",
    },
    GOOGLE_REFRESH_TOKEN: {
      type: "string",
    },
    DB_URL: {
      type: "string",
    },
    AUTH_SECRET: {
      type: "string",
    },
    GOOGLE_USER: {
      type: "string",
    },
    TOKEN_SECRET_KEY: {
      type: "string",
    },
  },
};

const config = envSchema({
  schema,
  dotenv: true, // load .env if it is there, default: false
});

export default config;
