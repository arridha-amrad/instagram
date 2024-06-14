ALTER TABLE "reply_likes" DROP CONSTRAINT "reply_likes_reply_id_comments_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply_likes" ADD CONSTRAINT "reply_likes_reply_id_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."replies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
