"use server";

import Link from "next/link";
import FormLogin from "./Form/FormLogin";
import GoogleButton from "@/components/SocialButtons/GoogleButton";
import GithubButton from "@/components/SocialButtons/GithubButton";
import FacebookButton from "@/components/SocialButtons/FacebookButton";
import SvgInstagram from "@/components/svg/SvgInstagram";

const Page = () => {
  return (
    <section className="flex">
      <div className="max-w-sm lg:block hidden w-full relative">
        <div className="absolute dark:bg-black/50 bg-black/20 inset-0" />
        <img
          src="https://images.unsplash.com/photo-1621207849166-0ccb2a48147b?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="bg"
          className="object-cover w-full h-full object-center"
        />
      </div>
      <main className="min-h-screen w-full flex items-center justify-center flex-col">
        <button>
          <SvgInstagram className="fill-skin-primary" />
        </button>
        <section className="text-center py-4">
          <h1 className="text-2xl font-semibold text-skin-muted">
            Sign in to your account
          </h1>
        </section>
        <section className="max-w-sm w-full">
          <FormLogin />
        </section>
        <section className="py-6 w-full max-w-sm">
          <span className="relative flex justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-slate-400 dark:via-slate-500 to-transparent opacity-75"></div>
            <span className="relative text-skin-muted z-10 bg-background px-6">
              Or
            </span>
          </span>
        </section>
        <section className="max-w-sm w-full flex items-center justify-center gap-2">
          <GoogleButton />
          <GithubButton />
          <FacebookButton />
        </section>
        <section className="text-sm pt-8">
          <span>Don't have an account ? </span>
          <Link className="text-skin-inverted" href="/register">
            register
          </Link>
        </section>
      </main>
    </section>
  );
};

export default Page;
