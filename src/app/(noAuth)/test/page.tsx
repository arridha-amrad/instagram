"use client";

import Button from "@/components/core/Button";
import { showToast } from "@/lib/utils";

export default function Page() {
  const launchToast = () => {
    showToast("Hello World", "success");
  };
  return (
    <main className="container mx-auto">
      <Button onClick={launchToast}>Click</Button>
    </main>
  );
}
