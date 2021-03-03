class BaseController {
    constructor(router, path) {
        this.router = router;
        this.path = path;
    }

    setPaths() {
        throw new Error('BaseController.setPaths must be overridden by the child class');
    }

    endPointPath(endpoint) {
        return `/${this.path}/${endpoint}`;
    }

    makeGetPath(endpoint, callback) {
        this.router.route(this.endPointPath(endpoint)).get(callback);
    }

    makePostPath(endpoint, callback) {
        this.router.route(this.endPointPath(endpoint)).post(callback);
    }
}

module.exports = BaseController;