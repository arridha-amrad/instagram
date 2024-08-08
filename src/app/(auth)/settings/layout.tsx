import LinkChangePassword from "@/components/Links/LinkChangePassword";
import LinkChangeUsername from "@/components/Links/LinkChangeUsername";
import LinkEditProfile from "@/components/Links/LinkEditProfile";
import SvgMeta from "@/components/svg/SvgMeta";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <main className="flex min-h-screen py-4">
      <section className="w-full max-w-xs space-y-6 border-r border-skin">
        <div className="px-4">
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        <AccountCenter />
        <div className="">
          <h1 className="px-4 text-xs font-semibold text-skin-muted">
            How you use nextgram
          </h1>
          <div className="h-2" />
          <LinkEditProfile />
          <LinkChangeUsername />
          <LinkChangePassword />
        </div>
      </section>
      <section className="flex-1 basis-0">{children}</section>
    </main>
  );
}

const AccountCenter = () => {
  return (
    <div style={{ width: 320 - 70 }} className="relative">
      <div className="absolute inset-0 -z-10 rounded-lg bg-skin-fill blur" />
      <div className="z-50 flex flex-col gap-2 rounded-lg bg-background p-4">
        <div className="flex items-center justify-start gap-2">
          <SvgMeta className="h-6 w-6 fill-blue-500" />
          <h1 className="">Meta</h1>
        </div>
        <h1 className="block font-semibold">Account Center</h1>
        <p className="text-xs text-skin-muted">
          Manage your connected experiences and account settings across Meta
          technologies like Facebook, Instagram and Meta Horizon.
        </p>
        <div className="flex items-center gap-2 text-xs text-skin-muted">
          <UserIcon className="aspect-square w-5" />
          <p>Personal details</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-skin-muted">
          <ShieldCheckIcon className="aspect-square w-5" />
          <p>Password and security</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-skin-muted">
          <DocumentTextIcon className="aspect-square w-5" />
          <p>Ads preferences</p>
        </div>
        <div className="text-sm">
          <Link href="/" className="font-semibold text-blue-500">
            See more on account ceter
          </Link>
        </div>
      </div>
    </div>
  );
};
