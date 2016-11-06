import LoginLogout from "../components/Header/Login/LoginLogout";
import {connect} from 'react-redux';
import {login, logout} from '../state/actions/login';

const mapStateToProps = (state) => {
    return {
        userAccessToken: localStorage.getItem('userAccessToken')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, password) => {
            dispatch(login(username, password));
        },
        onLogout: () => {
            dispatch(logout());
        }
    }
};

const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginLogout);

export default LoginContainer;