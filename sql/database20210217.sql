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

CREATE TABLE users (
    user_key uuid,
    project_id uuid REFERENCES projects (project_key),
    user_name varchar(256),
    role integer,
    password text,
    created_at date
);

----------------- TYPES ------------------
CREATE TYPE success_action AS (
    success boolean,
    message text
);

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
    level integer,
    name varchar(256)
);

CREATE TYPE role_type_array AS (
    success boolean,
    roles role_type[]
);

CREATE TYPE code_type AS (
    code varchar(100),
    valid boolean
);

CREATE TYPE code_type_array AS (
    success boolean,
    codes code_type[]
);

CREATE TYPE project_type AS (
    success boolean,
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

CREATE TYPE project_summary AS (
    project_key uuid,
    name varchar(256)
);

CREATE TYPE project_summary_array AS (
    success boolean,
    projects project_summary[]
);

CREATE TYPE user_type AS (
    success boolean,
    user_key uuid,
    project_id uuid,
    user_name varchar(256),
    role integer,
    created_at date
);

CREATE TYPE user_list AS (
    success boolean,
    users user_type[]
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
            true,
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

--------- SET ROLES -------
-- select setRoles('62673224-d25f-4bcf-ab1a-6f330c2e1644', ARRAY[row(0,'Owner')::role_type,row(1,'Manager')::role_type,row(2,'User')::role_type]);
CREATE or replace function setRoles(projectKey uuid, roles role_type[])
returns json as $setRoles$
declare
    result json;
    foundProject record;
begin
    select * from projects into foundProject where project_key=projectKey;
    if not found then
        result = row_to_json(row(false, 'Project not found')::failure_action);
    else
        DELETE FROM roles where project=projectKey;
        for ind in array_lower(roles, 1)..array_upper(roles, 1) loop
            insert into roles (project, level, name) values (projectKey, roles[ind].level, roles[ind].name);
        end loop;
        result = row_to_json(row(true, roles)::role_type_array);
    end if;
    return result;
end;
$setRoles$ language plpgsql;

--------- ADD ACTIVATION CODE ---------
CREATE or replace function addActivationCode(projectKey uuid)
returns json as $addActivationCode$
declare
    result json;
    foundProject record;
    code record;
    codes code_type[] = '{}';
    codeBase uuid = uuid_generate_v4();
    newCode text;
    current integer = 1;
begin
    select * from projects into foundProject where project_key=projectKey;
    if not found then
        result = row_to_json(row(false, 'No project found')::failure_action);
    else
        select split_part(CAST(codeBase AS text), '-', 5) into newCode;
        insert into activation_codes (project, code, valid) VALUES (projectKey, newCode, true);
        for code in select * from activation_codes where project=projectKey loop
            codes[current] = row(code.code, code.valid)::code_type;
            current = current + 1;
        end loop;
        result = row_to_json(row(true, codes)::code_type_array);
    end if;
    return result;
end;
$addActivationCode$ language plpgsql;

------------- GET PROJECTS ------------
CREATE or replace function getProjects(accountId integer)
returns json as $getProjects$
declare
    result json;
    foundAccount record;
    project record;
    projects project_summary[] = '{}';
    current integer = 1;
begin
    select * from accounts into foundAccount where id=accountId;
    if not found then
        result = row_to_json(row(false, 'No account found')::failure_action);
    else
        for project in select * from projects where account_id=accountId loop
            projects[current] = row(project.project_key, project.name)::project_summary;
            current = current + 1;
        end loop;
        result = row_to_json(row(true, projects)::project_summary_array);
    end if;
    return result;
end;
$getProjects$ language plpgsql;

----------- GET SINGLE PROJECT ----------------
CREATE or replace function getProject(projectKey uuid)
returns json as $getProject$
declare
    result json;
    foundProject record;
    code record;
    role record;
    codes code_type[] = '{}';
    userRoles role_type[] = '{}';
    currentCode integer = 1;
    currentRole integer = 1;
begin
    select * from projects into foundProject where project_key=projectKey;
    if not found then
        result = row_to_json(row(false, 'Project not found')::failure_action);
    else
        for code in select * from activation_codes where project=projectKey loop
            codes[currentCode] = row(code.code, code.valid)::code_type;
            currentCode = currentCode + 1;
        end loop;
        for role in select * from roles where project=projectKey loop
            userRoles[currentRole] = row(role.level, role.name)::role_type;
            currentRole = currentRole + 1;
        end loop;

        result = row_to_json(row(
            true,
            projectKey,
            foundProject.account_id,
            foundProject.name,
            foundProject.use_codes,
            foundProject.use_roles,
            foundProject.default_role,
            userRoles,
            codes,
            foundProject.created_at
        )::project_type);
    end if;
    return result;
end;
$getProject$ language plpgsql;

------------- Update Project Name --------------
CREATE or replace function updateProjectName(projectKey uuid, newName text)
returns json as $updateProjectName$
declare
    result json;
begin
    update projects set name=newName where project_key=projectKey;
    select getProject(projectKey) into result;
    return result;
end;
$updateProjectName$ language plpgsql;

------------- Update Use Codes ---------------------
CREATE or replace function updateUseCodes(projectKey uuid, useCodes boolean)
returns json as $updateUseCodes$
declare
    result json;
begin
    update projects set use_codes=useCodes where project_key=projectKey;
    select getProject(projectKey) into result;
    return result;
end;
$updateUseCodes$ language plpgsql;

------------ Update Use Roles ----------------
CREATE or replace function updateUseRoles(projectKey uuid, useRoles boolean)
returns json as $updateUseRoles$
declare
    result json;
begin
    update projects set use_roles=useRoles where project_key=projectKey;
    select getProject(projectKey) into result;
    return result;
end;
$updateUseRoles$ language plpgsql;

---------- CREATE NEW USER ----------
CREATE or replace function createNewUser(projectKey uuid, userName varchar(256), userPass text, activationCode text default '')
returns json as $createNewUser$
declare
    result json;
    foundProject record;
    foundUser record;
    foundCode record;
    isValid boolean;
    userKey uuid = uuid_generate_v4();
    createdAt date = now();
begin
    select * from projects into foundProject where project_key=projectKey;
    if not found then -- project not found
        isValid = false;
        result = row_to_json(row(false, 'Project not found')::failure_action);
    else -- project found
        select * from users into foundUser where project_id=projectKey AND user_name=userName;
        if not found then -- user not found
            if foundProject.use_codes then
                select * from activation_codes into foundCode where project=projectKey AND code=activationCode and valid=true;
                if not found then -- activation code not found
                    isValid = false;
                    result = row_to_json(row(false, 'Invalid activation code')::failure_action);
                else -- valid activation code
                    isValid = true;
                    update activation_codes set valid=false where project=projectKey and code=activationCode;
                end if; -- end code not found
            else 
                isValid = true;
            end if;
        else -- user found
            isValid = false;
            result = row_to_json(row(false, 'User name already in use')::failure_action);
        end if; -- end user not found
    end if; -- end project not found

    if isValid then 
        insert into users 
            (user_key, project_id, user_name, role, password, created_at) VALUES 
            (
                userKey,
                projectKey,
                userName,
                foundProject.default_role,
                crypt(userPass, gen_salt('bf')),
                createdAt
            );

            result = row_to_json(row(
                true,
                userKey,
                projectKey,
                userName,
                foundProject.default_role,
                createdAt
            )::user_type);
    end if;
    return result;
end;
$createNewUser$ language plpgsql;

-------------- LOGIN USER ------------------
CREATE or replace function loginUser(projectKey uuid, userName varchar(256), userPass text)
returns json as $loginUser$
declare
    result json;
    foundUser record;
begin
    select * from users into foundUser where project_id=projectKey AND user_name=userName AND password=crypt(userPass, password);
    if not found then
        result = row_to_json(row(false, 'User name or password incorrect')::failure_action);
    else
        result = row_to_json(row(
            true,
            foundUser.user_key,
            projectKey,
            userName,
            foundUser.role,
            foundUser.created_at
        )::user_type);
    end if;
    return result;
end;
$loginUser$ language plpgsql;

----------- UPDATE USER ROLE -------------
CREATE or replace function updateUserRole(projectKey uuid, userKey uuid, newRole integer)
returns json as $updateUserRole$
declare
    result json;
    foundUser record;
    foundRole record;
    isValid boolean = true;
begin
    select * from roles into foundRole where project=projectKey AND level=newRole;
    if not found then
        isValid = false;
        result = row_to_json(row(false, 'Invalid Role')::failure_action);
    end if; 

    select * from users into foundUser where user_key=userKey AND project_id=projectKey;
    if not found then
        isValid = false;
        result = row_to_json(row(false, 'User not found')::failure_action);
    end if;

    if isValid then
        update users set role=newRole where user_key=userKey AND project_id=projectKey;
        result = row_to_json(row(
            true,
            userKey,
            projectKey,
            foundUser.user_name,
            newRole,
            foundUser.created_at
        )::user_type);
    end if;
    return result;
end;
$updateUserRole$ language plpgsql;

------------- LIST USERS --------------
CREATE or replace function listUsers(projectKey uuid)
returns json as $listUsers$
declare
    result json;
    foundUser record;
    users user_type[] = '{}';
    current integer = 1;
begin
    for foundUser in select * from users where project_id=projectKey loop
        users[current] = row(
            true,
            foundUser.user_key,
            projectKey,
            foundUser.user_name,
            foundUser.role,
            foundUser.created_at
        )::user_type;
        current = current + 1;
    end loop;
    result = row_to_json(row(true, users)::user_list);
    return result;
end;
$listUsers$ language plpgsql;

----------------- DELETE USER -----------------------
CREATE or replace function deleteUser(projectKey uuid, userKey uuid)
returns json as $deleteUser$
declare
    result json;
    foundUser record;
begin
    select * from users into foundUser where project_id=projectKey AND user_key=userKey;
    if not found then
        -- Could just fail silently, but better to return a failure action indicating
        -- that the user being deleted doesn't exist in the database.
        result = row_to_json(row(false, 'User does not exist')::failure_action);
    else 
        delete from users where project_id=projectKey AND user_key=userKey;
        result = row_to_json(row(true, 'User successfully deleted')::success_action);
    end if;
    return result;
end;
$deleteUser$ language plpgsql;

------------ DELETE PROJECT -----------------------
CREATE or replace function deleteProject(projectKey uuid)
returns json as $deleteProject$
declare
    result json;
    foundProject record;
begin 
    select * from projects into foundProject where project_key=projectKey;
    if not found then
        -- don't just fail silently
        result = row_to_json(row(false, 'Project does not exist')::failure_action);
    else
        delete from roles where project=projectKey;
        delete from activation_codes where project=projectKey;
        delete from users where project_id=projectKey;
        delete from projects where project_key=projectKey;
        result = row_to_json(row(true, 'Project deleted')::success_action);
    end if;
    return result;
end;
$deleteProject$ language plpgsql;