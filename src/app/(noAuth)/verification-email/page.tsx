import FacebookButton from "@/components/SocialButtons/FacebookButton";
import GithubButton from "@/components/SocialButtons/GithubButton";
import GoogleButton from "@/components/SocialButtons/GoogleButton";
import SvgInstagram from "@/components/svg/SvgInstagram";
import { getEmailVerificationRequestCookie } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import Form from "./Form";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Instagram | Email Verification",
  description: "Email Verification",
};

const Page = async () => {
  const cookie = await cookies();
  const data = await getEmailVerificationRequestCookie(cookie);
  if (!data) {
    return (
      <div>
        <h1>You have no session to visit this page</h1>
        <Link href="/login">Back to login</Link>
      </div>
    );
  }
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
            Email Verification
          </h1>
        </section>
        <section className="w-full max-w-sm">
          <Form id={data} />
        </section>
        <section className="pt-8 text-sm">
          <span>Back to </span>
          <Link className="text-skin-inverted" href="/login">
            login
          </Link>
        </section>
      </main>
    </section>
  );
};

export default Page;
