----------------- EXTENSIONS ------------------
CREATE EXTENSION pgcrypto;
CREATE EXTENSION "uuid-ossp";

----------------- TABLES ------------------
--ACCOUNTS
CREATE TABLE accounts (
    id serial PRIMARY KEY,
    user_name varchar(256) unique,
    name varchar(256),
    password text,
    created_at date
);

----------------- TYPES ------------------
CREATE TYPE failure_action AS (
    success boolean,
    message text
);

----------------- FUNCTIONS ------------------