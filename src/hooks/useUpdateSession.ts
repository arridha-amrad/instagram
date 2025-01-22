import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useUpdateSession = (
  trigger: boolean,
  data?: Partial<Session["user"]>,
) => {
  const { update } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (trigger && data) {
      // const { email, id, image, name, username } = data;
      update(data).then(() => {
        router.refresh();
      });
    }
  }, [trigger]);
};
