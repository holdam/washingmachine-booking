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

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.login = this.login.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    login() {
        if (!!this.state.username && !!this.state.password) {
            // TODO selectedYear, selectedMonth
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
                        <FormControl onKeyPress={this.handleKeyPress} onChange={this.handleUsernameChange} type="text" placeholder={strings.login.username} />
                    </FormGroup>
                    {' '}
                    <FormGroup validationState={passwordIsValidState} controlId="loginFormPassword">
                        <FormControl onKeyPress={this.handleKeyPress} onChange={this.handlePasswordChange} type="password" placeholder={strings.login.password} />
                    </FormGroup>
                    {' '}
                    <Button bsStyle="primary" onClick={this.login}>{strings.login.login}</Button>
                    {' '}
                    <Button onClick={this.props.onStartCreateUserFlow}>{strings.login.createUser}</Button>
                    {this.props.hasLoginFailed ? <LoginFailed/> : null}
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