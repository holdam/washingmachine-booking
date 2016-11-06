import React from 'react';
import './Logout.css';
import {Button} from 'react-bootstrap'
import strings from '../../../strings';

class Logout extends React.Component {
    render() {
        return (
            <Button onClick={this.props.onLogout}>{strings.login.logout}</Button>
        )
    }
}

export default Logout;