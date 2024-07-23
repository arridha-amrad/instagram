"use client";

import { useSessionStore } from "@/stores/SessionStore";
import { loadPosts } from "./action";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import Spinner from "@/components/Spinner";
import { useHomeStore } from "@/lib/zustand/stores/homeStore";

const ButtonLoadMorePosts = () => {
  const { page, addPosts } = useHomeStore();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { session } = useSessionStore();
  const loadMore = async () => {
    setLoading(true);
    try {
      const result = await loadPosts({
        page: page + 1,
        userId: session?.user.id,
      });
      if (result?.data) {
        addPosts(result.data.posts);
      }
    } catch (err) {
      toast.error("Something went wrong", { theme });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={loadMore}
      className="relative h-14 w-full border border-skin text-skin-muted"
    >
      {loading ? <Spinner className="inline-flex w-5" /> : "Load More"}
    </button>
  );
};

export default ButtonLoadMorePosts;
