import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import AddBox from '@material-ui/icons/AddBox';
import { makeStyles } from '@material-ui/styles';
import { serverCall } from '../utils/server';
import { setCurrentProjectList } from '../utils/projectUtils';

const useStyles = makeStyles(theme => ({
    container: {
        [theme.breakpoints.up('md')]: {
            width: 980,
            marginTop: 24
        },
        width: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    title: {
        marginBottom: 15
    },
    projectCard: {
        marginBottom: 15
    },
    projectContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.secondary
    },
    projectName: {
        textDecoration: 'none',
        cursor: 'pointer'
    },
    projectDelete: {
        cursor: 'pointer'
    },
    newProjectName: {
        flexGrow: 1
    },
    addProject: {
        margin: 15,
        cursor: 'pointer'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dialog: {
        backgroundColor: theme.palette.secondary.main,
        textAlign: 'center',
        padding: '36px 36px',
        borderRadius: 15
    },
    dialogText: {
        marginBottom: 15
    },
    warningButton: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText
    }
}))

export function Dashboard(props) {
    const classes = useStyles();

    const modalStates = {
        LOADING: 'loading',
        DELETE: 'delete',
        ERROR: 'error'
    }

    const [newProjectName, setNewProjectName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalState, setModalState] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

    const addProject = () => {
        if (newProjectName.trim()) {
            setModalMessage('Creating new project');
            setModalState(modalStates.LOADING);
            setShowModal(true);
            serverCall('project/create', {projectName: newProjectName}, 'post')
            .then(result => {
                if (result.success) {
                    setCurrentProjectList();
                    setNewProjectName('');
                    setShowModal(false);
                }
                else {
                    setModalMessage(result.message);
                    setModalState(modalStates.ERROR);
                    setShowModal(true);
                }
            })
            .catch(__error => {
                setModalMessage('A problem occurred while creating the project. Please try again.');
                setModalState(modalStates.ERROR);
                setShowModal(true);
            })
            
        }
    };

    const confirmDelete = (id, name) => {
        setSelectedProject(id);
        setModalMessage(`Are you sure you want to delete this project: '${name}'?`);
        setModalState(modalStates.DELETE);
        setShowModal(true);
    }

    const deleteProject = () => {
        if(selectedProject.trim()) {
            setModalMessage('Deleting project');
            setModalState(modalStates.LOADING);
            setShowModal(true);
            serverCall('/project', {project: selectedProject}, 'delete')
            .then(result => {
                if (result.success) {
                    setCurrentProjectList();
                    setSelectedProject('');
                    setShowModal(false);
                }
                else {
                    setModalMessage(result.message);
                    setModalState(modalStates.ERROR);
                    setShowModal(true);
                }
            })
            .catch(__error => {
                setModalMessage('An error occurred. Please try again.');
                setModalState(modalStates.ERROR);
                setShowModal(true);
            })
        }
    }

    const addKeyDown = (e) => {
        if (e.key === 'Enter') {
            addProject();
        }
    }

    const getModal = () => {
        switch(modalState) {
            case modalStates.DELETE:
                return (
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h5" className={classes.dialogText} color="error">{modalMessage}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" className={classes.warningButton} onClick={deleteProject}>Yes</Button>
                            <Button variant="contained" color="primary" onClick={() => {setShowModal(false)}}>No</Button>
                        </Grid>
                    </Grid>
                );
            case modalStates.ERROR:
                return (
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h5" className={classes.dialogText} color="error">{modalMessage}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={() => {setShowModal(false)}}>OK</Button>
                        </Grid>
                    </Grid>
                )
            default:
                return (
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h5" className={classes.dialogText}>{modalMessage}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <CircularProgress />
                        </Grid>
                    </Grid>
                );
        }
    }

    return (
        <React.Fragment>
            <Box className={classes.container}>
                <Grid container>
                    <Grid item xs={12}>
                    <Typography className={classes.title} variant="h5" color="primary">Projects</Typography>
                    </Grid>
                    {
                        props.projects.map(project => (
                            <Grid item xs={12} key={project.project_key}>
                                <Card className={classes.projectCard}>
                                    <CardContent className={classes.projectContainer}>
                                        <Typography className={classes.projectName} variant="body1" color="primary" component={Link} to={`project/${project.project_key}`}>{project.name}</Typography>
                                        <Delete className={classes.projectDelete} color="error" onClick={() => {confirmDelete(project.project_key, project.name)}} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    }
                    <Grid item xs={12} className={classes.projectContainer}>
                        <TextField className={classes.newProjectName} name='newProject' label="New Project Name" onChange={(e) => {setNewProjectName(e.target.value)}} onKeyDown={addKeyDown} />
                        <AddBox className={classes.addProject} color="primary" onClick={addProject} />
                    </Grid>
                </Grid>
            </Box>
            <Modal open={showModal} className={classes.modal}>
                <Box className={classes.dialog}>
                    {getModal()}
                </Box>
            </Modal>
        </React.Fragment>
        
    )
}

const mapStateToProps = (state) => ({
    projects: state.projects
});

export default connect(mapStateToProps)(Dashboard);