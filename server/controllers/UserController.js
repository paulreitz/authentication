const BaseController = require('./BaseController');
const UserDB = require('../database/userdb');
const getUserToken = require('../utils/token').getUserToken;
const verifyUserToken = require('../utils/token').verifyUserToken;

class UserController extends BaseController {
    setPaths() {
        this.userDB = new UserDB();
        this.makePostPath('create', this.createUser);
        this.makePostPath('auth', this.loginUser);
        this.makePostPath('token', this.verifyToken);
        this.makePostPath('role', this.updateUserRole);
        this.makeGetPath('', this.listUsers);
        this.makeDeletePath('', this.deleteUser);
    }

    createUser = (req, res) => {
        if (req.body && req.body.projectKey && req.body.userName && req.body.userPass) {
            this.userDB.createUser(req.body.projectKey, req.body.userName, req.body.userPass, req.body.activationCode)
            .then(result => {
                const data = getUserToken(result);
                res.status(200).send(data);
            })
            .catch(error => {
                res.status(200).send({error});
            });
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'});
        }
    }

    loginUser = (req, res) => {
        if (req.body && req.body.projectKey && req.body.userName && req.body.userPass) {
            this.userDB.loginUser(req.body.projectKey, req.body.userName, req.body.userPass)
            .then(result => {
                const data = getUserToken(result);
                res.status(200).send(data);
            })
            .catch(error => {
                res.status(200).send({error});
            });
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'});
        }
    }

    updateUserRole = (req, res) => {
        if (req.body && req.body.projectKey && req.body.userKey && req.body.hasOwnProperty('role')) {
            this.userDB.updateUserRole(req.body.projectKey, req.body.userKey, req.body.role)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            });
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'});
        }
    }

    listUsers = (req, res) => {
        if (req.body && req.body.project) {
            this.userDB.listUsers(req.body.project)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            });
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'});
        }
    }

    deleteUser = (req, res) => {
        if (req.body && req.body.project && req.body.user) {
            this.userDB.deleteUser(req.body.project, req.body.user)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            });
        }
        else {
            res.status.send({success: false, message: 'Invalid information'});
        }
    }

    verifyToken = (req, res) => {
        if (req.body && req.body.token) {
            const data = verifyUserToken(req.body.token);
            if (data) {
                res.status(200).send(data);
            }
            else {
                res.status(403).send({success: false, message: 'Invalid token'});
            }
        }
        else {
            res.status(200).send({success: false, message: 'No token provided'});
        }
    }
}

module.exports = UserController;