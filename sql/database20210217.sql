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
    default_role integer,
    created_at date
);

CREATE TABLE roles (
    project uuid REFERENCES projects (project_key),
    level integer,
    name varchar(256)
);

CREATE TABLE activation_codes (
    project uuid REFERENCES projects (project_key),
    code varchar(100),
    valid boolean
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

CREATE TYPE role_type AS (
    project uuid,
    level integer,
    name varchar(256)
);

CREATE TYPE code_type AS (
    project uuid,
    code varchar(100),
    valid boolean
);

CREATE TYPE project_type AS (
    project_key uuid,
    account_id integer,
    name varchar(256),
    use_codes boolean,
    use_roles boolean,
    default_role integer,
    roles role_type[],
    codes code_type[],
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

------ CREATE PROJECT ------
CREATE or replace function createProject(accountId integer, projectName varchar(256))
returns json as $createProject$
declare
    result json;
    foundAccount record;
    createdAt date = now();
    projectKey uuid = uuid_generate_v4();
begin
    select * from accounts into foundAccount where id=accountId;
    if not found then
        result = row_to_json(row(false, 'No account found')::failure_action);
    else
        insert into projects 
            (project_key, account_id, name, use_codes, use_roles, default_role, created_at)
            VALUES (projectKey, accountId, projectName, true, false, 0, createdAt);
        result = row_to_json(row(
            projectKey,
            accountId,
            projectName,
            true,
            false,
            0,
            ARRAY[]::role_type[],
            ARRAY[]::code_type[],
            createdAt
        )::project_type);
    end if;
    return result;
end;
$createProject$ language plpgsql;