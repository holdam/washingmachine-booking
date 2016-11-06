import React from 'react';
import Login from './Login'
import Logout from './Logout'
import './LoginLogout.css'

class LoginLogout extends React.Component {

    render() {
        let panel = null;
        if (!!this.props.userAccessToken) {
            panel = <Logout onLogout={this.props.onLogout} />;
        } else {
            panel = <Login onLogin={this.props.onLogin} />
        }

        return (
            <div className="loginLogout">
                {panel}
            </div>
        )
    }
}

export default LoginLogout;