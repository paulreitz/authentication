const BaseController = require('./BaseController');
const AccountDB = require('../database/accountdb');
const getAccountToken = require('../utils/token').getAccountToken;
const verifyToken = require('../utils/token').verifyToken;

class AccountController extends BaseController {

    setPaths() {
        this.accountDB = new AccountDB();
        this.makePostPath('create', this.createAccount);
        this.makePostPath('auth', this.loginAccount);
        this.makePostPath('refresh', this.refreshToken);
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

    refreshToken = (req, res) => {
        if (req.body && req.body.token) {
            const data = verifyToken(`token ${req.body.token}`);
            if (data) {
                const refreshData = getAccountToken({
                    id: data.id,
                    user_name: data.userName,
                    name: data.displayName,
                    created_at: data.createdAt
                });
                res.status(200).send(refreshData);
            }
            else {
                res.status(200).send({success: false, message: 'Invalid Token'});
            }
        }
        else {
            res.status(200).send({success:false, message: 'No Token Provided'});
        }
    }
}

module.exports = AccountController;