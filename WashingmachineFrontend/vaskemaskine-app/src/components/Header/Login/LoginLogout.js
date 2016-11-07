import React from 'react';
import Login from './Login'
import Logout from './Logout'
import './LoginLogout.css'

class LoginLogout extends React.Component {
    constructor(props) {
        super(props);
        // Load username if user is logged in
        if (!!this.props.userAccessToken) {
            this.props.setup(this.props.userAccessToken);
        }
    }

    render() {
        let panel = null;
        if (!!this.props.userAccessToken) {
            panel = <Logout onLogout={this.props.onLogout} username={this.props.username}  />;
        } else {
            panel = <Login
                onLogin={this.props.onLogin}
                showCreateUserModal={this.props.showCreateUserModal}
                onStartCreateUserFlow={this.props.onStartCreateUserFlow}
                onEndCreateUserFlow={this.props.onEndCreateUserFlow}
                onCreateUser={this.props.onCreateUser}
            />
        }

        return (
            <div className="loginLogout">
                {panel}
            </div>
        )
    }
}

export default LoginLogout;