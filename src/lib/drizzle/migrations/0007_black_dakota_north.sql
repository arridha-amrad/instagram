CREATE TABLE IF NOT EXISTS "search_users" (
	"user_id" uuid NOT NULL,
	"search_id" uuid NOT NULL,
	CONSTRAINT "search_users_search_id_user_id_pk" PRIMARY KEY("search_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_users" ADD CONSTRAINT "search_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_users" ADD CONSTRAINT "search_users_search_id_users_id_fk" FOREIGN KEY ("search_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relations_search_users_user_idx" ON "search_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "relations_search_users_search_idx" ON "search_users" USING btree ("search_id");