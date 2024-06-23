"use client";

import follow from "@/actions/user/follow";
import ButtonFollowSubmit from "./ButtonFollowSubmit";
import { usePathname } from "next/navigation";

type Props = {
  authId: string;
  userId: string;
  isFollow: boolean;
};

const FormFollow = ({ authId, userId, isFollow }: Props) => {
  const pathname = usePathname();
  const fa = follow.bind(null, { authId, userId, pathname });

  return (
    <form action={fa}>
      <ButtonFollowSubmit isFollow={isFollow} />
    </form>
  );
};

export default FormFollow;
