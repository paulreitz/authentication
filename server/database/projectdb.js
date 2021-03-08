const BaseDB = require('./basedb');

class ProjectDB extends BaseDB {
    createProject(accountId, projectName) {
        return new Promise((resolve, reject) => {
            const query = `SELECT createProject(${accountId}, '${projectName}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].createproject);
            });
        });
    }

    setRoles(projectKey, roles) {
        return new Promise((resolve, reject) => {
            const rolesArray = roles.map((r,i) => `row(${i},'${r}')::role_type`);
            const query = `SELECT setRoles('${projectKey}', ARRAY[${rolesArray.join(',')}]);`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].setroles);
            });
        });
    }

    addActivationCode(projectKey) {
        return new Promise((resolve, reject) => {
            const query = `SELECT addActivationCode('${projectKey}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].addactivationcode);
            });
        });
    }

    getProjects(accountId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT getProjects(${accountId});`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].getprojects);
            });
        });
    }

    getProject(projectKey) {
        return new Promise((resolve, reject) => {
            const query = `SELECT getProject('${projectKey}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].getproject);
            });
        });
    }

    updateProjectName(projectKey, newName) {
        return new Promise((resolve, reject) => {
            const query = `SELECT updateProjectName('${projectKey}','${newName}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].updateprojectname);
            });
        });
    }

    updateUseCodes(projectKey, useCodes) {
        return new Promise((resolve, reject) => {
            const query = `SELECT updateUseCodes('${projectKey}', ${useCodes});`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].updateusecodes);
            });
        });
    }

    updateUseRoles(projectKey, useRoles) {
        return new Promise((resolve, reject) => {
            const query = `SELECT updateUseRoles('${projectKey}', ${useRoles});`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].updateuseroles);
            });
        });
    }

    deleteProject = (project) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT deleteProject('${project}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].deleteproject);
            })
        })
    }
}

module.exports = ProjectDB;