import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useUpdateSession = (trigger: boolean, data?: Session["user"]) => {
  const { update } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (trigger && data) {
      const { email, id, image, name, username } = data;
      update({
        id,
        username,
        image,
        name,
        email,
      }).then(() => {
        router.refresh();
      });
    }
  }, [trigger]);
};
