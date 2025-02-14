const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const AccountController = require('./controllers/AccountController');
const ProjectController = require('./controllers/ProjectController');
const UserController = require('./controllers/UserController');

const router = express.Router();
const publicPath = path.join(__dirname, '..', 'build');
const port = process.env.PORT || 3008;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

[
    new AccountController(router, 'account'),
    new ProjectController(router, 'project'),
    new UserController(router, 'user')
].forEach(controller => {
    controller.setPaths();
})

app.use('/api', router);
app.use(express.static(publicPath));
app.get('*', (__req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});