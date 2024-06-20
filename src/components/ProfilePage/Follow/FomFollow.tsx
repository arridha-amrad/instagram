"use client";

import follow from "@/actions/user/follow";
import ButtonFollowSubmit from "./ButtonFollowSubmit";

type Props = {
  authId: string;
  userId: string;
  isFollow: boolean;
};

const FormFollow = ({ authId, userId, isFollow }: Props) => {
  const fa = follow.bind(null, { authId, userId });

  return (
    <form action={fa}>
      <ButtonFollowSubmit isFollow={isFollow} />
    </form>
  );
};

export default FormFollow;
