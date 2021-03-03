const Pool = require('pg').Pool;
const config = require('./dbconfig');

class BaseDB {
    constructor() {
        this.pool = new Pool(config);
    }
}

module.exports = BaseDB;