import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import { makeStyles } from '@material-ui/styles';
import { unsetAccount } from '../store/actions/AccountActions';

const useStyles = makeStyles(theme => ({
    toolbarMargin: {
        ...theme.mixins.toolbar
    },
    appbar: {
        backgroundColor: theme.palette.common.lightBlue,
        borderBottom: `2px solid ${theme.palette.common.darkerGreen}`
    },
    icon: {
        marginRight: 5
    }
}));

export function Header(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <AppBar className={classes.appbar} position="fixed" elevation={0}>
                <Toolbar>
                    <VerifiedUser className={classes.icon} color="primary" />
                    <Typography variant="h5" color="primary">Authentication Service</Typography>
                </Toolbar>
            </AppBar>
            <Box className={classes.toolbarMargin} />
        </React.Fragment>
    )
}

const mapDispatchToProps = (dispatch) => ({
    unsetUser: () => dispatch(unsetAccount)
});

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.account.token,
    displayName: state.account.displayName
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);