import './CreateUserModal.css'
import * as React from "react";
import {Modal, Form, FormGroup, Col, ControlLabel, Button} from 'react-bootstrap';
import strings from '../../../../strings';
import ErrorMessages from '../../../../commons/ErrorMessages';
import fetch from 'isomorphic-fetch';

class CreateUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMessages: []
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleCreateUser = this.handleCreateUser.bind(this);
        this.cancelCreateUser = this.cancelCreateUser.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleCreateUser() {
        let errorMessages = [];
        const username = this.state.username;
        const password = this.state.password;
        if (!username) {
            errorMessages.push(strings.login.createUserModal.errorsMessages.usernameCantBeEmpty);
        }
        if (!password) {
            errorMessages.push(strings.login.createUserModal.errorsMessages.passwordCantBeEmpty);
        }

        // TODO check if username exists already

        this.setState({errorMessages: errorMessages});

        fetch('//localhost:8080/user/username_exists')
            .then(function (response) {

            });

        if (errorMessages.length === 0) {
       //     this.props.onCreateUser(this.state.username, this.state.password);
        }
    }

    cancelCreateUser() {
        this.setState({errorMessages: []});
        this.props.onCancelCreateUser();
    }

    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.cancelCreateUser}>
                <Modal.Header closeButton>
                    <Modal.Title>{strings.login.createUser}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ErrorMessages alertVisible={this.state.errorMessages.length > 0}>
                        {this.state.errorMessages}
                    </ErrorMessages>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.login.username}
                            </Col>
                            <Col sm={8}>
                                <input onChange={this.handleUsernameChange} type="text" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.login.password}
                            </Col>
                            <Col sm={8}>
                                <input onChange={this.handlePasswordChange} type="password" />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.cancelCreateUser}>{strings.createBookingModal.cancel}</Button>
                    <Button onClick={this.handleCreateUser} bsStyle="primary">{strings.createBookingModal.save}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default CreateUserModal;