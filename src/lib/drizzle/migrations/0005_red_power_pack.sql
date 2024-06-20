CREATE TABLE IF NOT EXISTS "followings_table" (
	"user_id" uuid NOT NULL,
	"follow_id" uuid NOT NULL,
	CONSTRAINT "followings_table_user_id_follow_id_pk" PRIMARY KEY("user_id","follow_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followings_table" ADD CONSTRAINT "followings_table_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followings_table" ADD CONSTRAINT "followings_table_follow_id_users_id_fk" FOREIGN KEY ("follow_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relations_user_idx" ON "followings_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relations_follow_idx" ON "followings_table" USING btree ("follow_id");