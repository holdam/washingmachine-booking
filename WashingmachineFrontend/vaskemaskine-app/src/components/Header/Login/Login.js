import React from 'react';
import {Form, FormGroup, FormControl, Button} from 'react-bootstrap'
import strings from '../../../strings';
import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    login() {
        if (!!this.state.username || !!this.state.password) {
            this.props.onLogin(this.state.username, this.state.password);
        }
    }

    render() {
        let usernameIsValidClass = (!!this.state.username) ? '' : 'invalid';
        let passwordIsValidClass = (!!this.state.password) ? '' : 'invalid';


        return (
            <div className="login">
                <Form inline>
                    <FormGroup controlId="loginFormUsername">
                        <FormControl className={usernameIsValidClass} onChange={this.handleUsernameChange} type="text" placeholder={strings.login.username} />
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="loginFormPassword">
                        <FormControl className={passwordIsValidClass} onChange={this.handlePasswordChange} type="password" placeholder={strings.login.password} />
                    </FormGroup>
                    {' '}
                    <Button onClick={this.login}>{strings.login.login}</Button>
                </Form>
            </div>
        )
    }
}

export default Login;