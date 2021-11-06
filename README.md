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

5. Create Database

```bash
CREATE DATABASE dbtest;
```

6. Export ENV

```bash
export PG_HOST=127.0.0.1
export PG_PORT=5432
export PG_USER=user_login
export PG_PASS=password
export PG_DB=dbtest
export PORT=9090

export DATABASE_URL=postgres://user_login:password@127.0.0.1:5432/db-test
export DATABASE_TEST_URL=postgres://user_login:password@127.0.0.1:5432/db-integration-test

export REDIS_HOST=127.0.0.1
export REDIS_PORT=6379
export REDIS_CACHE_EXPIRES_IN=604800
```

6. Create tables and insert test data, please take a look for db.sql

### Install go packages & run app
