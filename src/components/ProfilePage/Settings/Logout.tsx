"use client";

import { useState } from "react";
import Button from "@/components/core/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "@/components/core/Modals/Wrapper";
import MySpinner from "@/components/Spinner";

const Logout = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.replace("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <fieldset className="flex items-center justify-center" disabled={loading}>
      <button onClick={() => setOpen(true)} className="py-3">
        Logout
      </button>

      {open && (
        <Modal closeModal={closeModal}>
          <div className="relative max-w-sm overflow-hidden rounded-md border border-skin bg-background">
            <section className="border-b border-skin p-4">
              <h1 className="text-center text-xl font-semibold">Logout</h1>
            </section>
            <p className="px-4 py-8 text-center text-sm text-skin-muted">
              This action will clear your session. You need to relogin again to
              use this app. Are you sure?
            </p>
            <section className="flex justify-end gap-3 p-4">
              <button
                onClick={closeModal}
                className="rounded-md border border-skin px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <Button
                disabled={loading}
                onClick={logout}
                className="w-32 text-sm"
              >
                {loading ? <MySpinner /> : "Yes, Continue"}
              </Button>
            </section>
          </div>
        </Modal>
      )}
    </fieldset>
  );
};

export default Logout;
