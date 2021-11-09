### Setup database

1. Pull & run docker image

- postgres

```bash
docker run -it -d -p 5432:5432 --name postgres-local -e POSTGRES_PASSWORD=password postgres
```

- redis

```bash
docker run --name local-redis -d -p 6379:6379 redis
```

2. Go into docker container

```bash
docker exec -it postgres-local bash
```

3. Login pg

```bash
psql -h localhost -U postgres
```

4. Create user

```bash
CREATE USER "user_login" WITH PASSWORD 'password';
ALTER ROLE "user_login" WITH SUPERUSER;
```

5. Create two databases

```bash
CREATE DATABASE dbtest;

# using for ci test
CREATE DATABASE db-test-integration;
```

6. Export ENV

```bash
export PG_HOST=127.0.0.1
export PG_PORT=5432
export PG_USER=user_login
export PG_PASS=password
export PG_DB=dbtest
export PORT=3131

export DATABASE_URL=postgres://user_login:password@127.0.0.1:5432/dbtest
export DATABASE_TEST_URL=postgres://user_login:password@127.0.0.1:5432/db-integration-test

export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379
export REDIS_CACHE_EXPIRES_IN=604800
```

6. Create tables and insert test data for both of dbtest and db-test-integration
- Open Postgres SQL IDE or PG4Admin and copy SQL command into editor and run on both of databases.

```sql
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
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('Administrator', 'admin', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'ADMIN');
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('User','user', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'USER');
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('Accountant','accountant', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'USER');
INSERT INTO public.users (name, username, "password", "createdAt", "roleType") VALUES('DevOps','devops', '$2a$10$MSlzbaal5/i3PMaGMDocjefbyQzdR58MWMyWA1JrFScgsmO4Fku62', '2021-10-31 08:20:35.159', 'USER');
```

### Setting project before running

1.Intsall npm packages

```bash
npm install
```

2.Run prisma generate to generate Prisma Client

```bash
npx prisma generate
```
3. Commands

- Development

```bash
npm run dev
```

- Buid

```bash
npm run build
```

- Production

```bash
npm run start
```

- Run Unit Testing

```bash
npm run test
```

- Run Integration Testing

```bash
npm run test:integration
```

- Run a single test integration

```
npm run test:integration:auth
```
### Open API

- After start app server, we can use Open Api
```link
http://localhost:3131/api/#/
```
### Postman
- Import postman collection for testing apis
```postman
postman/daikou.postman_collection.json
```
![image](https://user-images.githubusercontent.com/12770929/140653784-8695a403-a9f8-4ebd-91d5-08c2819670ec.png)

### Ci integration test

![image](https://user-images.githubusercontent.com/12770929/140634141-68f34c12-6f25-4846-8c03-65629299266c.png)
