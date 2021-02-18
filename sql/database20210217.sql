----------------- EXTENSIONS ------------------
CREATE EXTENSION pgcrypto;
CREATE EXTENSION "uuid-ossp";

----------------- TABLES ------------------
CREATE TABLE accounts (
    id serial PRIMARY KEY,
    user_name varchar(256) unique,
    name varchar(256),
    password text,
    created_at date
);

CREATE TABLE projects (
    project_key uuid unique,
    account_id integer REFERENCES accounts (id),
    name varchar(256),
    use_codes boolean,
    use_roles boolean,
    created_at date
);

----------------- TYPES ------------------
CREATE TYPE failure_action AS (
    success boolean,
    message text
);

CREATE TYPE account_type AS (
    success boolean,
    id integer,
    user_name varchar(256),
    name varchar(256),
    created_at date
);

----------------- FUNCTIONS ------------------

-------- CREATE_ACCOUNT-------- 
CREATE or replace function createAccount(userName varchar(256), displayName varchar(256), userPass text)
returns json as $createAccount$
declare
    result json;
    assignedId integer;
    createdAt date = now();
    foundAccount record;
begin
    select * from accounts into foundAccount where user_name=userName;
    if not found then
        insert into accounts (user_name, name, password, created_at) VALUES (userName, displayName, crypt(userPass, gen_salt('bf')), createdAt) returning id into assignedId;
        result = row_to_json(row(
            true,
            assignedId,
            userName,
            displayName,
            createdAt
        )::account_type);
    else
        result = row_to_json(row(false, 'Account name already in use')::failure_action);
    end if;
    return result;
end;
$createAccount$ language plpgsql;

------ LOGIN_ACCOUNT ---------
CREATE or replace function loginAccount(userName varchar(256), userPass text)
returns json as $loginAccount$
declare
    result json;
    foundAccount record;
begin
    select * from accounts into foundAccount where user_name=userName and password=crypt(userPass, password);
    if not found then
        result = row_to_json(row(false, 'User name or password incorrect')::failure_action);
    else
        result = row_to_json(row(
            true,
            foundAccount.id,
            foundAccount.user_name,
            foundAccount.name,
            foundAccount.created_at
        )::account_type);
    end if;
    return result;
end;
$loginAccount$ language plpgsql;