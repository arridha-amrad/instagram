CREATE TABLE IF NOT EXISTS "comment_likes" (
	"user_id" uuid NOT NULL,
	"comment_id" uuid NOT NULL,
	CONSTRAINT "comment_likes_comment_id_user_id_pk" PRIMARY KEY("comment_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "message" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
