import LoginLogout from "../components/Header/Login/LoginLogout";
import {connect} from 'react-redux';
import {login, logout, fetchUsernameForToken, createUser, loginFailed} from '../state/actions/login';
import {startCreateUserFlow, endCreateUserFlow} from '../state/actions/createUserFlow';

const mapStateToProps = (state) => {
    return {
        userAccessToken: localStorage.getItem('userAccessToken'),
        username: state.login.username,
        showCreateUserModal: state.createUserFlow.showCreateUserModal,
        hasLoginFailed: state.login.hasLoginFailed
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, password) => {
            dispatch(login(username, password));
        },
        onLogout: () => {
            dispatch(logout());
        },
        onLoginFailed: (error) => {
            dispatch(loginFailed(error));
        },
        setup: (userAccessToken) => {
            dispatch(fetchUsernameForToken(userAccessToken));
        },
        onStartCreateUserFlow: () => {
            dispatch(startCreateUserFlow());
        },
        onEndCreateUserFlow: () => {
            dispatch(endCreateUserFlow());
        },
        onCreateUser: (username, password) => {
            dispatch(endCreateUserFlow());
            dispatch(createUser(username, password));
        }
    }
};

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginLogout);

export default LoginContainer;