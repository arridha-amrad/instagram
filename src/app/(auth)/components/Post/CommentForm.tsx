"use client";

const CommentForm = () => {
  return (
    <section className="py-2">
      <div className="border-b border-skin pb-4">
        <input
          type="text"
          className="placeholder:text-skin-muted focus:ring-0 px-0 w-full border-none text-sm bg-background"
          placeholder="Add a comment..."
        />
      </div>
    </section>
  );
};

export default CommentForm;
