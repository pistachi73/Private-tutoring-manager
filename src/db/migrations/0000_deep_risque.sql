CREATE TYPE "public"."payment_frequency" AS ENUM('one-time', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."time_investment" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."schedule_type" AS ENUM('on-demand', 'recurrent');--> statement-breakpoint
CREATE TYPE "public"."session_exception_reason" AS ENUM('cancelled', 'skip', 'reschedule');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" serial NOT NULL,
	"hub_id" serial NOT NULL,
	"cost" integer NOT NULL,
	"billingType" "payment_frequency" NOT NULL,
	"tentative" boolean DEFAULT true,
	"invoice_sent" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"image" text,
	"paymentFrequency" "payment_frequency" DEFAULT 'monthly',
	"location" text,
	"nationality" text,
	"age" integer,
	"timeInvestment" "time_investment" DEFAULT 'medium',
	"job" text,
	"away_until" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" serial NOT NULL,
	"hubId" serial NOT NULL,
	CONSTRAINT "client_hub_clientId_hubId_unique" UNIQUE("clientId","hubId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"scheduleType" "schedule_type" NOT NULL,
	"default_session_price" integer NOT NULL,
	"cancelation_policy_hours" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "password_reset_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"hub_id" serial NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"price" integer NOT NULL,
	"is_recurring" boolean DEFAULT false,
	"recurrence_rule" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_exception" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" serial NOT NULL,
	"exception_date" timestamp NOT NULL,
	"reason" "session_exception_reason" NOT NULL,
	"new_start_time" timestamp,
	"new_end_time" timestamp,
	"comments" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_confirmation" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "two_factor_confirmation_user_id_token_unique" UNIQUE("user_id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "two_factor_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"emailVerified" timestamp DEFAULT now(),
	"password" text,
	"salt" text,
	"role" text DEFAULT 'USER',
	"is_two_factor_enabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing" ADD CONSTRAINT "billing_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing" ADD CONSTRAINT "billing_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_hub" ADD CONSTRAINT "client_hub_clientId_client_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_hub" ADD CONSTRAINT "client_hub_hubId_hub_id_fk" FOREIGN KEY ("hubId") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hub" ADD CONSTRAINT "hub_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_exception" ADD CONSTRAINT "session_exception_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_confirmation" ADD CONSTRAINT "two_factor_confirmation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_hub_clientId_index" ON "client_hub" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_hub_hubId_index" ON "client_hub" USING btree ("hubId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "two_factor_confirmation_token_index" ON "two_factor_confirmation" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_index" ON "user" USING btree ("email");