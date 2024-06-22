import { ReactNode } from "react";

export default async function Layout({
  children,
  modalEditProfile,
}: {
  children: ReactNode;
  modalEditProfile: ReactNode;
}) {
  return (
    <>
      {children}
      {modalEditProfile}
    </>
  );
}
