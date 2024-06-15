CREATE TABLE IF NOT EXISTS "followers" (
	"user_id" uuid NOT NULL,
	"to_id" uuid NOT NULL,
	CONSTRAINT "followers_user_id_to_id_pk" PRIMARY KEY("user_id","to_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "followings" (
	"user_id" uuid NOT NULL,
	"to_id" uuid NOT NULL,
	CONSTRAINT "followings_user_id_to_id_pk" PRIMARY KEY("user_id","to_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_to_id_users_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followings" ADD CONSTRAINT "followings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followings" ADD CONSTRAINT "followings_to_id_users_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
