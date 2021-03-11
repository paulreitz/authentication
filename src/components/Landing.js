import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import Check from '@material-ui/icons/Check';
import Block from '@material-ui/icons/Block';
import { setAccount } from '../store/actions/AccountActions';
import { serverCall } from '../utils/server';
import { connect } from 'react-redux';

const iconSize = 40;

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
    registerContainer: {
        borderRight: '1px solid black'
    },
    form: {
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    title: {
        textAlign: 'center',
        marginBottom: 15
    },
    field: {
        marginBottom: 10,
        paddingLeft: 24
    },
    check: {
        color: 'green',
        paddingTop: 10,
        paddingLeft: 10,
        width: iconSize,
        height: iconSize
    },
    block: {
        paddingTop: 10,
        paddingLeft: 10,
        width: iconSize,
        height: iconSize
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dialog: {
        backgroundColor: 'white',
        textAlign: 'center',
        padding: '36px 54px',
        borderRadius: 15
    },
    dialogText: {
        marginBottom: 24
    }
}))

export function Landing(props) {
    const classes = useStyles();

    const [registerAccountName, setRegisterAccountName] = useState('');
    const [registerDisplayName, setRegisterDisplayName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerVerify, setRegisterVerify] = useState('');
    const [verified, setVerified] = useState(false);

    const [loginAccountName, setLoginAccountNamme] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const verify = (a,b) => {
        setVerified(a && a === b);
    }

    const setStore = (token) => {
        window.localStorage.setItem('token', token);
    }

    const doRegister = () => {
        if (verified && registerAccountName) {
            setIsError(false);
            setLoadingMessage('Registering, please wait....');
            setLoading(true);
            const data = {
                userName: registerAccountName,
                displayName: registerDisplayName,
                password: registerPassword
            }
            serverCall('account/create', data, 'post')
            .then(result => {
                if (result.success) {
                    setLoading(false);
                    setLoadingMessage('');
                    const accountData = {
                        id: result.id,
                        userName: result.userName,
                        displayName: result.displayName,
                        createdAt: result.createdAt,
                        token: result.token
                    }
                    setStore(result.token);
                    props.setAccount(accountData);
                }
                else {
                    setErrorMessage(result.message);
                    setIsError(true);
                    setLoading(true);
                }
            })
        }
    }

    const doLogin = () => {
        if (loginAccountName && loginPassword) {
            setIsError(false);
            setLoadingMessage('Logging in...');
            setLoading(true);
            const loginData = {
                userName: loginAccountName,
                password: loginPassword
            }
            serverCall('account/auth', loginData, 'post')
            .then(result => {
                if (result.success) {
                    setLoading(false);
                    setLoadingMessage('');
                    const accountData = {
                        id: result.id,
                        userName: result.userName,
                        displayName: result.displayName,
                        createdAt: result.createdAt,
                        token: result.token
                    }
                    setStore(result.token);
                    props.setAccount(accountData);
                }
                else {
                    setErrorMessage(result.message);
                    setIsError(true);
                    setLoading(true);
                }
            })
        }
    }

    const loginKeyDown = (e) => {
        if (e.key === 'Enter') {
            doLogin();
        }
    }

    const registerKeyDown = (e) => {
        if (e.key === 'Enter') {
            doRegister();
        }
    }

    const register = (
        <Box className={classes.form}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" className={classes.title}>Register</Typography>
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <TextField id="name" label="Account Name" onChange={(e) => setRegisterAccountName(e.target.value)} onKeyDown={registerKeyDown} />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <TextField id="displayName" label="Display Name" onChange={(e) => setRegisterDisplayName(e.target.value)} onKeyDown={registerKeyDown} />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <TextField id="password" label="Password" type="password" onChange={(e) => {setRegisterPassword(e.target.value); verify(e.target.value, registerVerify);}} onKeyDown={registerKeyDown} />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <TextField id="verify" label="Verify Password" type="password" onChange={(e) => {setRegisterVerify(e.target.value); verify(registerPassword, e.target.value);}} onKeyDown={registerKeyDown} />
                    {
                        verified
                        ? (<Check className={classes.check} />)
                        : (<Block color="error" className={classes.block} />)
                    }
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <Button variant="contained" color="primary" onClick={doRegister}>Register</Button>
                </Grid>
            </Grid>
        </Box>
    );

    const login = (
        <Box className={classes.form}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" className={classes.title}>Login</Typography>
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <TextField name="lname" label="Account Name" onChange={(e) => {setLoginAccountNamme(e.target.value)}} onKeyDown={loginKeyDown} />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <TextField name="lpassword" label="Password" type="password" onChange={(e) => {setLoginPassword(e.target.value)}} onKeyDown={loginKeyDown} />
                </Grid>
                <Grid item xs={12} className={classes.field}>
                    <Button variant="contained" color="primary" onClick={doLogin}>Login</Button>
                </Grid>
            </Grid>
        </Box>
    )

    return (
        <React.Fragment>
            <Box className={classes.container}>
                <Grid container>
                    <Grid item xs={12} sm={6} className={classes.registerContainer}>
                        {register}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {login}
                    </Grid>
                </Grid>
            </Box>
            <Modal open={loading} className={classes.modal}>
                <Box className={classes.dialog}>
                    {
                        isError
                        ? (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5" color="error" className={classes.dialogText}>{errorMessage}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={() => {setLoading(false)}}>OK</Button>
                                </Grid>
                            </Grid>
                        )
                        : (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5" className={classes.dialogText}>{loadingMessage}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <CircularProgress />
                                </Grid>
                            </Grid>
                        )
                    }
                </Box>
            </Modal>
        </React.Fragment>
    )
}

const mapDispatchToProps = (dispatch) => ({
    setAccount: (accountData) => dispatch(setAccount(accountData))
});

export default connect(undefined, mapDispatchToProps)(Landing);