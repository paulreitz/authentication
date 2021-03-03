const BaseDB = require('./basedb');

class AccountDB extends BaseDB {

    createAccount = (userName, displayName, password) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT createAccount('${userName}', '${displayName}', '${password}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].createaccount);
            })
        })
    }

    loginAccount = (userName, password) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT loginAccount('${userName}', '${password}');`;
            this.pool.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result.rows[0].loginaccount);
            })
        })
    }
}

module.exports = AccountDB;