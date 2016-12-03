import LoginLogout from "../components/Header/Login/LoginLogout";
import {connect} from 'react-redux';
import {login, logout, fetchUserDataIfTokenIsPresent, createUser, loginFailed} from '../state/actions/login';
import {startCreateUserFlow, endCreateUserFlow} from '../state/actions/createUserFlow';

const mapStateToProps = (state) => {
    return {
        realName: state.login.realName,
        isLoggedIn: !!state.login.username,
        showCreateUserModal: state.createUserFlow.showCreateUserModal,
        hasLoginFailed: state.login.hasLoginFailed,
        selectedMonthAsDate: state.calendar.selectedMonthAsDate,
        loginInProgress: state.login.loginInProgress
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, password, selectedYear, selectedMonth) => {
            dispatch(login(username, password, selectedYear, selectedMonth));
        },
        onLogout: () => {
            dispatch(logout());
        },
        onLoginFailed: (error) => {
            dispatch(loginFailed(error));
        },
        setup: () => {
            dispatch(fetchUserDataIfTokenIsPresent());
        },
        onStartCreateUserFlow: () => {
            dispatch(startCreateUserFlow());
        },
        onEndCreateUserFlow: () => {
            dispatch(endCreateUserFlow());
        },
        onCreateUser: (username, password, name, apartment, selectedYear, selectedMonth) => {
            dispatch(endCreateUserFlow());
            dispatch(createUser(username, password, name, apartment, selectedYear, selectedMonth));
        }
    }
};

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginLogout);

export default LoginContainer;