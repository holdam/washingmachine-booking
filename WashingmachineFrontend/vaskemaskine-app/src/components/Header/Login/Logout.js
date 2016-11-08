import React from 'react';
import './Logout.css';
import {Button} from 'react-bootstrap'
import strings from '../../../commons/strings';

class Logout extends React.Component {
    render() {
        return (
            <div>
                <span>{this.props.username}</span>
                {' '}
                <Button onClick={this.props.onLogout}>{strings.login.logout}</Button>
            </div>
        )
    }
}

export default Logout;