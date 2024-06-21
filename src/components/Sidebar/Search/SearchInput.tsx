import MySpinner from "@/components/Spinner";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useDebounce } from "use-debounce";

const SearchInput = () => {
  const { pending } = useFormStatus();
  const [text, setText] = useState("");
  const [value] = useDebounce(text, 500);

  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (value !== "") {
      btnRef.current?.click();
    }
  }, [value]);

  return (
    <div className="relative">
      <label htmlFor="Search" className="sr-only">
        Search
      </label>
      <input
        name="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        type="text"
        id="Search"
        placeholder="Search user..."
        className="mt-1.5 w-full resize-none rounded-md border border-skin bg-skin-input pe-10 outline-none focus:border-transparent focus:ring focus:ring-skin-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
      />
      <span className="absolute inset-y-0 end-0 grid w-10 translate-y-0.5 place-content-center">
        <button
          ref={btnRef}
          type="submit"
          className="aspect-square h-full text-gray-600 hover:text-gray-700"
        >
          <span className="sr-only">Search</span>

          {pending ? (
            <MySpinner />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6 pt-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          )}
        </button>
      </span>
    </div>
  );
};

export default SearchInput;
