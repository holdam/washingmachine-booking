import React from 'react';
import Login from './Login/Login'
import Logout from './Logout/Logout'
import './LoginLogout.css'

class LoginLogout extends React.Component {
    constructor(props) {
        super(props);
        this.props.setup();
    }

    render() {
        let panel = null;
        if (this.props.isLoggedIn) {
            panel = <Logout
                onLogout={this.props.onLogout}
                realName={this.props.realName}
            />;
        } else {
            panel = <Login
                onLogin={this.props.onLogin}
                showCreateUserModal={this.props.showCreateUserModal}
                onStartCreateUserFlow={this.props.onStartCreateUserFlow}
                onEndCreateUserFlow={this.props.onEndCreateUserFlow}
                onCreateUser={this.props.onCreateUser}
                hasLoginFailed={this.props.hasLoginFailed}
                onLoginFailed={this.props.onLoginFailed}
                selectedMonthAsDate={this.props.selectedMonthAsDate}
                loginInProgress={this.props.loginInProgress}
                    />;
        }

        return (
            <div className="loginLogout">
                {panel}
            </div>
        )
    }
}

export default LoginLogout;