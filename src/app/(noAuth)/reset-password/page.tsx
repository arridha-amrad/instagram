import SvgInstagram from "@/components/svg/SvgInstagram";
import type { Metadata } from "next";
import Form from "./Form";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Instagram | Reset Password",
  description: "Reset Password",
};

const Page = async () => {
  return (
    <section className="flex">
      <div className="relative hidden w-full max-w-sm lg:block">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/50" />
        <img
          src="https://images.unsplash.com/photo-1621207849166-0ccb2a48147b?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
            Reset Password
          </h1>
        </section>
        <section className="w-full max-w-sm">
          <Suspense>
            <Form />
          </Suspense>
        </section>
        <section className="pt-8">
          <span className="text-sm">
            Back to &nbsp;
            <Link className="text-skin-inverted" href="/login">
              login
            </Link>
          </span>
        </section>
      </main>
    </section>
  );
};

export default Page;
