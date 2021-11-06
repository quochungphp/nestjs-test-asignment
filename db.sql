--- create role type
CREATE TYPE "roleType" AS ENUM ('ADMIN', 'USER', 'EDITOR');

--- create user table
CREATE TABLE public.users (
  id bigserial NOT NULL,
  name varchar(50) NOT NULL,
  username varchar(50) unique NOT NULL,
  password varchar(100) NOT NULL,
  "createdAt" timestamp(6) NULL DEFAULT LOCALTIMESTAMP,
  "roleType" "roleType" default 'USER' NOT NULL,
  CONSTRAINT users_PK PRIMARY KEY (id)
);

--- create index
CREATE INDEX "roleType_IDX"  ON public."users" USING btree ("roleType");
CREATE INDEX "createdAt_IDX"  ON public."users" USING btree ("createdAt");


--- insert users
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('Aministrator', 'admin', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'ADMIN');
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('User','user', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'USER');
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('Accountant','ccountant', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'USER');
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('DevOps','devops', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'USER');
