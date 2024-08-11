"use client";

import ChatBubbleOvalLeftIcon from "@heroicons/react/24/outline/ChatBubbleOvalLeftIcon";

type Props = {
  focusToCommentInput: VoidFunction;
};

const ButtonComment = ({ focusToCommentInput }: Props) => {
  return (
    <button onClick={focusToCommentInput}>
      <ChatBubbleOvalLeftIcon className="aspect-square w-7 -scale-x-100" />
    </button>
  );
};

export default ButtonComment;
