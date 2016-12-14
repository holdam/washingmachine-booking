import './CreateUserModal.css'
import * as React from "react";
import {Modal, Form, FormGroup, Col, ControlLabel, Button} from 'react-bootstrap';
import strings from '../../../../commons/strings';
import ErrorMessages from '../../../../commons/ErrorMessages';
import fetch from 'isomorphic-fetch';
import urls from '../../../../commons/urls';

class CreateUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            name: '',
            apartment: '---',
            errorMessages: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCreateUser = this.handleCreateUser.bind(this);
        this.cancelCreateUser = this.cancelCreateUser.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleCreateUser() {
        let errorMessages = [];
        const username = this.state.username;
        const password = this.state.password;
        const name = this.state.name;
        const apartment = this.state.apartment;

        if (!username) {
            errorMessages.push(strings.login.createUserModal.errorsMessages.usernameCantBeEmpty);
        }

        if (!password) {
            errorMessages.push(strings.login.createUserModal.errorsMessages.passwordCantBeEmpty);
        }

        if (!name) {
            errorMessages.push(strings.login.createUserModal.errorsMessages.nameCantBeEmpty);
        }

        if (apartment === '---') {
            errorMessages.push(strings.login.createUserModal.errorsMessages.mustChooseApartment);
        }

        fetch(`${urls.api.user}/username_exists?username=${username}`)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                if (data.success === false) {
                    errorMessages.push(strings.login.createUserModal.errorsMessages.usernameTaken);
                }

                this.setState({errorMessages: errorMessages});

                if (errorMessages.length === 0) {
                    this.props.onCreateUser(
                        this.state.username,
                        this.state.password,
                        this.state.name,
                        this.state.apartment,
                        this.props.selectedMonthAsDate.getFullYear(),
                        this.props.selectedMonthAsDate.getMonth()
                    );
                }
            }.bind(this));
    }

    cancelCreateUser() {
        this.setState({errorMessages: []});
        this.props.onCancelCreateUser();
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.handleCreateUser();
        }
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
                                <input autoFocus="true"
                                       onKeyPress={this.handleKeyPress}
                                       name="username"
                                       onChange={this.handleChange}
                                       type="text"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.login.password}
                            </Col>
                            <Col sm={8}>
                                <input
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange}
                                    name="password"
                                    type="password" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.login.createUserModal.realName}
                            </Col>
                            <Col sm={8}>
                                <input
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange}
                                    name="name"
                                    type="text" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.login.createUserModal.apartment}
                            </Col>
                            <Col sm={8}>
                                <ApartmentPicker onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.cancelCreateUser}>{strings.bookingModal.cancel}</Button>
                    <Button onClick={this.handleCreateUser} bsStyle="primary">{strings.bookingModal.save}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const ApartmentPicker = (props) => {
    let apartments = ['---', 'st.v.', 'st.h.', '1.tv.', '1.th.', '2.', '3.tv.', '3.th.', '4.'];
    let apartmentOptions = apartments.map((apartment) => {
        return (
            <option key={apartment} value={apartment}>{apartment}</option>
        )
    });

    return (
        <select className="apartment-picker" onChange={props.onChange} name="apartment">
            {apartmentOptions}
        </select>
    )
};

export default CreateUserModal;