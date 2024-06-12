"use client";

import { signIn } from "next-auth/react";
import SvgGoogle from "../svg/SvgGoogle";

const GoogleButton = () => {
  const googleLogin = async () => {
    await signIn("google", { redirect: false, callbackUrl: "/" });
  };
  return (
    <button
      onClick={googleLogin}
      className="inline-flex gap-3 items-center border border-skin rounded-md px-3 py-2 text-skin-muted"
    >
      <SvgGoogle /> google
    </button>
  );
};

export default GoogleButton;
