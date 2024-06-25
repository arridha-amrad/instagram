import FacebookButton from "@/components/SocialButtons/FacebookButton";
import GithubButton from "@/components/SocialButtons/GithubButton";
import GoogleButton from "@/components/SocialButtons/GoogleButton";
import SvgInstagram from "@/components/svg/SvgInstagram";
import Link from "next/link";
import FormRegister from "./FormRegister";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram | Register",
  description: "Create an instagram account",
};

const Page = () => {
  return (
    <section className="flex">
      <div className="relative hidden w-full max-w-sm lg:block">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1620600574091-386cc6a3ed4d?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="bg"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center">
        <button>
          <SvgInstagram className="fill-skin-primary" />
        </button>
        <section className="py-4 text-center">
          <h1 className="text-2xl font-semibold text-skin-muted">
            Create new account
          </h1>
        </section>
        <section className="w-full max-w-sm">
          <FormRegister />
        </section>
        <section className="w-full max-w-sm py-6">
          <span className="relative flex justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-75 dark:via-slate-500"></div>
            <span className="relative z-10 bg-background px-6 text-skin-muted">
              Or
            </span>
          </span>
        </section>
        <section className="flex w-full max-w-sm items-center justify-center gap-2">
          <GoogleButton />
          <GithubButton />
          <FacebookButton />
        </section>
        <section className="pt-8 text-sm">
          <span>Already have an account ? </span>
          <Link className="text-skin-inverted" href="/login">
            login
          </Link>
        </section>
      </main>
    </section>
  );
};

export default Page;
