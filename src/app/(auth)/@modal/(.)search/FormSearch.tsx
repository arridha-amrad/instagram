"use client";

import SearchInput from "@/components/Sidebar/Search/SearchInput";
import Form from "next/form";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

export default function FormSearch() {
  const [query, setQuery] = useState("");
  const [value] = useDebounce(query, 500);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (value) {
      formRef.current?.requestSubmit();
    }
  }, [value]);

  return (
    <Form scroll={false} ref={formRef} action="">
      <SearchInput
        value={query}
        name="query"
        onChange={(e) => setQuery(e.target.value)}
      />
    </Form>
  );
}
