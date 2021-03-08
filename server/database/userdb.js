const BaseDB = require('./basedb');

class UserDB extends BaseDB {
    createUser = (projectKey, userName, userPass, activationCode) => {
        return new Promise((resolve, reject) => {
            const query = activationCode
                ? `SELECT createNewUser('${projectKey}','${userName}','${userPass}','${activationCode}');`
                : `SELECT createNewUser('${projectKey}','${userName}','${userPass}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].createnewuser);
            });
        });
    }

    loginUser = (projectKey, userName, userPass) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT loginUser('${projectKey}','${userName}','${userPass}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].loginuser);
            });
        });
    }

    updateUserRole = (projectKey, userKey, newRole) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT updateUserRole('${projectKey}','${userKey}',${newRole});`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].updateuserrole);
            });
        });
    }

    listUsers = (project) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT listUsers('${project}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].listusers);
            });
        });
    }

    deleteUser = (project, userKey) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT deleteUser('${project}','${userKey}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].deleteuser);
            })
        })
    }
}

module.exports = UserDB;