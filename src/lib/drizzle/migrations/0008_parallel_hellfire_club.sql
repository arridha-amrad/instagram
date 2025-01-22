CREATE TABLE "email_verification_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"email" varchar NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "search_users" DROP CONSTRAINT "search_users_search_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "search_users" ADD CONSTRAINT "pk" PRIMARY KEY("search_id","user_id");--> statement-breakpoint
ALTER TABLE "email_verification_request" ADD CONSTRAINT "email_verification_request_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_index" ON "email_verification_request" USING btree ("user_id");