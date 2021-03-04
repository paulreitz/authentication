const BaseController = require('./BaseController');
const AccountDB = require('../database/accountdb');
const getAccountToken = require('../utils/token').getAccountToken;

class AccountController extends BaseController {

    setPaths() {
        this.accountDB = new AccountDB();
        this.makePostPath('create', this.createAccount);
        this.makePostPath('auth', this.loginAccount);
    }

    createAccount = (req, res) => {
        if (req.body && req.body.userName && req.body.displayName && req.body.password) {
            this.accountDB.createAccount(req.body.userName, req.body.displayName, req.body.password)
            .then(result => {
                if (result.success) {
                    const data = getAccountToken(result);
                    res.status(200).send(data);
                }
                else {
                    res.status(200).send(result);
                }
            })
            .catch(error => {
                res.status(200).send({error})
            })
        }
    }

    loginAccount = (req, res) => {
        if (req.body && req.body.userName && req.body.password) {
            this.accountDB.loginAccount(req.body.userName, req.body.password)
            .then(result => {
                if (result.success) {
                    const data = getAccountToken(result);
                    res.status(200).send(data);
                }
                else {
                    res.status(200).send(result);
                }
            })
            .catch(error => {
                res.status(200).send({error});
            })
        }
    }
}

module.exports = AccountController;