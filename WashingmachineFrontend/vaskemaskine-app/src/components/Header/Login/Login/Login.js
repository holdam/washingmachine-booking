import React from 'react';
import {Form, FormGroup, FormControl, Button} from 'react-bootstrap'
import strings from '../../../../commons/strings';
import CreateUserModal from '../CreateUserModal/CreateUserModal';
import './Login.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    login() {
        if (!!this.state.username && !!this.state.password) {
            this.props.onLogin(this.state.username, this.state.password,
                this.props.selectedMonthAsDate.getFullYear(), this.props.selectedMonthAsDate.getMonth());
        } else {
            this.props.onLoginFailed('Username or password missing');
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.login();
        }
    }

    render() {
        let usernameIsValidState = (!!this.state.username) ? 'success' : 'error';
        let passwordIsValidState = (!!this.state.password) ? 'success' : 'error';

        return (
            <div className="login">
                <Form inline>
                    <FormGroup validationState={usernameIsValidState} controlId="loginFormUsername">
                        <FormControl
                            onKeyPress={this.handleKeyPress}
                            onChange={this.handleChange}
                            name="username"
                            type="text"
                            placeholder={strings.login.username} />
                    </FormGroup>
                    {' '}
                    <FormGroup validationState={passwordIsValidState} controlId="loginFormPassword">
                        <FormControl
                            onKeyPress={this.handleKeyPress}
                            onChange={this.handleChange}
                            name="password"
                            type="password"
                            placeholder={strings.login.password} />
                    </FormGroup>
                    {' '}
                    <Button bsStyle="primary" onClick={this.login}>{strings.login.login}</Button>
                    {' '}
                    <Button onClick={this.props.onStartCreateUserFlow}>{strings.login.createUser}</Button>
                    {this.props.hasLoginFailed && !this.props.loginInProgress ? <LoginFailed/> : null}
                </Form>
                <CreateUserModal
                    showModal={this.props.showCreateUserModal}
                    onCancelCreateUser={this.props.onEndCreateUserFlow}
                    onCreateUser={this.props.onCreateUser}
                    selectedMonthAsDate={this.props.selectedMonthAsDate}
                />
            </div>
        )
    }
}

function LoginFailed(props) {
    return (
        <span className="login-failed">{strings.login.loginFailed}</span>
    )
}

export default Login;