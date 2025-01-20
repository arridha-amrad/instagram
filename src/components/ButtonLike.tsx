import { cn } from "@/lib/utils";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";

type Props = {
  isLike: boolean;
  callback: VoidFunction;
  size?: "small" | "normal";
};

export default function ButtonLike({
  callback,
  isLike,
  size = "normal",
}: Props) {
  return (
    <button onClick={callback}>
      {isLike ? (
        <Heart
          className={cn(size === "small" ? "w-4" : "w-7", "fill-pink-600")}
        />
      ) : (
        <HeartIcon className={cn(size === "small" ? "w-4" : "w-7")} />
      )}
    </button>
  );
}
