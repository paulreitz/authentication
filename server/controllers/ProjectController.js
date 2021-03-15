const BaseController = require('./BaseController');
const ProjectDB = require('../database/projectdb');
const verifyToken = require('../utils/token').verifyToken;

class ProjectController extends BaseController {

    setPaths() {
        this.projectDB = new ProjectDB();
        this.makePostPath('create', this.createProject);
        this.makePostPath('roles', this.setRoles);
        this.makePostPath('code', this.addActivationCode);
        this.makePostPath('project', this.getProjects); // TODO: This creates a redundant path - fix.
        this.makeGetPath(':id', this.getProject);
        this.makePostPath('name/:id', this.updateProjectName);
        this.makePostPath('use/:id', this.updateProjectUses);
        this.makeDeletePath('', this.deleteProject);
    }

    createProject = (req, res) => {
        const account = verifyToken(req.get('x-access-token'));
        if (account && req.body && req.body.projectName) {
            this.projectDB.createProject(account.id, req.body.projectName)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            })
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'});
        }
    }

    setRoles = (req, res) => {
        const account = verifyToken(req.get('x-access-token'));
        if (account && req.body && req.body.projectKey && req.body.roles) {
            this.projectDB.setRoles(req.body.projectKey, req.body.roles)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            })
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'})
        }
    }

    addActivationCode = (req, res) => {
        const account = verifyToken(req.get('x-access-token'));
        if (account && req.body && req.body.projectKey) {
            this.projectDB.addActivationCode(req.body.projectKey)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            })
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'});
        }
    }

    getProjects = (req, res) => {
        const account = verifyToken(req.get('x-access-token'));
        if (account) {
            this.projectDB.getProjects(account.id)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            })
        }
        else {
            res.status(200).send({success: false, message: 'Must be logged in to view projects'});
        }
    }

    getProject = (req, res) => {
        const account = verifyToken(req.get('x-access-token'));
        if (account && req.params && req.params.id) {
            this.projectDB.getProject(req.params.id)
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                res.status(200).send({error});
            })
        }
        else {
            res.status(200).send({success: false, message: 'Invalid information'});
        }
    }

    updateProjectName = (req, res) => {
        const account = verifyToken(req.get('x-access-token'));
        if (account && req.body && req.body.newName && req.params && req.params.id) {
            this.projectDB.updateProjectName(req.params.id, req.body.newName)
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

    updateProjectUses = (req, res) => {
        const account = verifyToken(req.get('x-access-token'));
        const useCodes = req.body.hasOwnProperty('useCodes');
        const useRoles = req.body.hasOwnProperty('useRoles');
        if (account && req.body && (useCodes || useRoles) && req.params && req.params.id) {
            const call = useCodes
                ? this.projectDB.updateUseCodes(req.params.id, req.body.useCodes)
                : this.projectDB.updateUseRoles(req.params.id, req.body.useRoles);
            call
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

    deleteProject = (req, res) => {
        if (req.body && req.body.project) {
            this.projectDB.deleteProject(req.body.project)
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
}

module.exports = ProjectController;