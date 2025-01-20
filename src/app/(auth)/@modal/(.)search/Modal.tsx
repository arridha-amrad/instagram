"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { ReactNode, useEffect, useState } from "react";
import FormSearch from "./FormSearch";
import { createPortal } from "react-dom";

// export default function Modal({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(true);
//   const router = useRouter();

//   // useEffect(() => {
//   //   if (pathname !== "/search") {
//   //     setOpen(false);
//   //   }
//   // }, [pathname]);

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={() => {
//           setOpen(false);
//           router.back();
//         }}
//         className="relative z-50"
//       >
//         <DialogBackdrop className="fixed inset-0 bg-background/50 backdrop-blur" />
//         <div className="fixed inset-0 flex items-start justify-center p-4">
//           <DialogPanel className="w-full max-w-lg space-y-4 rounded-lg bg-background p-4 drop-shadow">
//             <FormSearch />
//             {children}
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   );
// }

export default function Modal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("overflow-y-hidden", "pr-4");
    } else {
      document.documentElement.classList.remove("overflow-y-hidden", "pr-4");
    }
  }, [open]);

  const closeModal = () => {
    setOpen(false);
    router.back();
  };
  return (
    open &&
    createPortal(
      <section className="fixed inset-0 flex items-center justify-center">
        <div
          onClick={closeModal}
          className="absolute inset-0 bg-background/50 backdrop-blur"
        />
        <div className="relative w-full max-w-lg space-y-4 rounded-lg bg-background p-4 drop-shadow">
          <FormSearch />
          {children}
        </div>
      </section>,
      document.body,
    )
  );
}
