import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import strings from '../../../../commons/strings';
import {monthNames} from '../../../../commons/util';
import './CreateBookingModal.css';
import {ControlLabel, Form, FormGroup, Col, Alert} from "react-bootstrap";
import ErrorMessages from '../../../../commons/ErrorMessages';

class CreateBookingModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleHourStartChange = this.handleHourStartChange.bind(this);
        this.handleMinuteStartChange = this.handleMinuteStartChange.bind(this);
        this.handleHourEndChange = this.handleHourEndChange.bind(this);
        this.handleMinuteEndChange = this.handleMinuteEndChange.bind(this);
        this.handleNumberOfWashingsChange = this.handleNumberOfWashingsChange.bind(this);
        this.handleNumberOfTumbleDriesChange = this.handleNumberOfTumbleDriesChange.bind(this);
        this.handleCreateBooking = this.handleCreateBooking.bind(this);
        this.handleEditBooking = this.handleEditBooking.bind(this);
        this.cancelBooking = this.cancelBooking.bind(this);
        this.validations = this.validations.bind(this);
        this.handleDeleteBooking = this.handleDeleteBooking.bind(this);

        this.state = {
            id: -1,
            startHour: 8,
            startMinutes: 0,
            endHours: 8,
            endMinutes: 0,
            numberOfWashingMachineUses: 0,
            numberOfTumbleDryUses: 0,
            errorMessages: [],
            isEditMode: false
        }
    }

    componentWillReceiveProps(nextProps) {
        // Load values if passed
        if (nextProps.isEditMode) {
            let startDate = new Date(nextProps.editBookingInformation.startTime);
            let endDate = new Date(nextProps.editBookingInformation.endTime);

            console.log(nextProps)

            this.setState({
                id: nextProps.editBookingInformation.id,
                startHour: startDate.getHours(),
                startMinutes: startDate.getMinutes(),
                endHours: endDate.getHours(),
                endMinutes: endDate.getMinutes(),
                numberOfWashingMachineUses: nextProps.editBookingInformation.numberOfWashingMachineUses,
                numberOfTumbleDryUses: nextProps.editBookingInformation.numberOfTumbleDryUses,
                isEditMode: true
            });
        }
    }

    handleHourStartChange(event) {
        this.setState({startHour: event.target.value});
    }

    handleMinuteStartChange(event) {
        this.setState({startMinutes: event.target.value});
    }

    handleHourEndChange(event) {
        this.setState({endHours: event.target.value});
    }

    handleMinuteEndChange(event) {
        this.setState({endMinutes: event.target.value});
    }

    handleNumberOfWashingsChange(event) {
        this.setState({numberOfWashingMachineUses: event.target.value});
    }

    handleNumberOfTumbleDriesChange(event) {
        this.setState({numberOfTumbleDryUses: event.target.value});
    }

    handleCreateBooking() {
        let errorMessages = this.validations();

        this.setState({
            errorMessages
        });

        let startTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        startTimeOfNewBooking.setHours(this.state.startHour);
        startTimeOfNewBooking.setMinutes(this.state.startMinutes);

        let endTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        endTimeOfNewBooking.setHours(this.state.endHours);
        endTimeOfNewBooking.setMinutes(this.state.endMinutes);

        if (errorMessages.length === 0) {
            this.props.onCreateBooking(startTimeOfNewBooking.getTime(), endTimeOfNewBooking.getTime(),
                this.state.numberOfWashingMachineUses, this.state.numberOfTumbleDryUses);
        }
    }

    handleEditBooking() {
        let errorMessages = this.validations();

        this.setState({
            errorMessages
        });

        let startTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        startTimeOfNewBooking.setHours(this.state.startHour);
        startTimeOfNewBooking.setMinutes(this.state.startMinutes);

        let endTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        endTimeOfNewBooking.setHours(this.state.endHours);
        endTimeOfNewBooking.setMinutes(this.state.endMinutes);

        if (errorMessages.length === 0) {
            this.props.onEditBooking(this.state.id, startTimeOfNewBooking.getTime(), endTimeOfNewBooking.getTime(),
                this.state.numberOfWashingMachineUses, this.state.numberOfTumbleDryUses);
        }
    }

    handleDeleteBooking() {
        let confirmation = window.confirm(strings.createBookingModal.confirmDeletion);
        if (confirmation) {
            this.props.onDeleteBooking(this.state.id);
        }
    }

    validations() {
        // Validations
        let errorMessages = [];

        if (this.props.bookingDate < new Date()) {
            errorMessages.push(strings.createBookingModal.errorsMessages.dayIsBeforeToday);
        }

        if (this.state.endHours >= 22 && this.state.endMinutes > 0) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustEndBefore22);
        }

        let timeDifference = (this.state.endMinutes - this.state.startMinutes >= 0)
            ? {hour: (this.state.endHours - this.state.startHour), minutes: (this.state.endMinutes - this.state.startMinutes)}
            : {hour: (this.state.endHours - this.state.startHour - 1), minutes: (60 - (this.state.startMinutes + this.state.endMinutes))};

        if (timeDifference.hour < 0 || (timeDifference.hour <= 0 && timeDifference.minutes < 30)) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustReserveAtLeast30Minutes);
        }

        if (this.state.numberOfWashingMachineUses <= 0 && this.state.numberOfTumbleDryUses <= 0) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustReserveEitherTumbleDrierOrWashingMachine);
        }

        let startTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        startTimeOfNewBooking.setHours(this.state.startHour);
        startTimeOfNewBooking.setMinutes(this.state.startMinutes);

        let endTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        endTimeOfNewBooking.setHours(this.state.endHours);
        endTimeOfNewBooking.setMinutes(this.state.endMinutes);

        for (let booking of this.props.bookings) {
            if (booking.startTime < endTimeOfNewBooking.getTime() && booking.endTime > startTimeOfNewBooking.getTime() && booking.id !== this.state.id) {
                errorMessages.push(strings.createBookingModal.errorsMessages.bookingIsClashing);
            }
        }

        if (!this.props.isLoggedIn) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustBeLoggedIn);
        }

        return errorMessages;
    }

    cancelBooking() {
        // Reset values when closing modal
        this.setState({
            id: -1,
            startHour: 8,
            startMinutes: 0,
            endHours: 8,
            endMinutes: 0,
            numberOfWashingMachineUses: 0,
            numberOfTumbleDryUses: 0,
            errorMessages: [],
            isEditMode: false
        });

        this.props.onCancelBookingCreation();
        this.props.onCancelEditBookingCreation();
    }

    render() {
        let createOrEditButton = (this.props.isEditMode)
            ? <EditButton handleClick={this.handleEditBooking} />
            : <CreateButton handleClick={this.handleCreateBooking} />;

        return (
            <Modal show={this.props.showModal} onHide={this.cancelBooking}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {`${this.props.isEditMode ? strings.createBookingModal.titleEdit : strings.createBookingModal.titleCreate} ${this.convertDateToString((this.props.bookingDate || new Date()))}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ErrorMessages alertVisible={this.state.errorMessages.length > 0}>
                        {this.state.errorMessages}
                    </ErrorMessages>
                    <Form horizontal>
                        <FormGroup controlId="formStartTime">
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.createBookingModal.startTime}
                            </Col>
                            <Col sm={7}>
                                <div>
                                    <HourTimePicker hour={this.state.startHour} handleChange={this.handleHourStartChange} />
                                    <MinuteTimePicker minutes={this.state.startMinutes} handleChange={this.handleMinuteStartChange} />
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formEndTime">
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.createBookingModal.endTime}
                            </Col>
                            <Col sm={7}>
                                <div>
                                    <HourTimePicker hour={this.state.endHours} handleChange={this.handleHourEndChange} />
                                    <MinuteTimePicker minutes={this.state.endMinutes} handleChange={this.handleMinuteEndChange} />
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.createBookingModal.numberOfWashes}
                            </Col>
                            <Col sm={7}>
                                <input onChange={this.handleNumberOfWashingsChange} className="numberOfWashingsPicker" value={this.state.numberOfWashingMachineUses} type="number" min="0" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.createBookingModal.numberOfTumbleDries}
                            </Col>
                            <Col sm={7}>
                                <input onChange={this.handleNumberOfTumbleDriesChange} className="numberOfTumbleDryPicker" value={this.state.numberOfTumbleDryUses} type="number" min="0" />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {this.props.isEditMode ? <Button className="deleteButton" bsStyle="danger" onClick={this.handleDeleteBooking}>{strings.createBookingModal.delete}</Button> : null}
                    <Button onClick={this.cancelBooking}>{strings.createBookingModal.cancel}</Button>
                    {createOrEditButton}
                </Modal.Footer>
            </Modal>
        )
    }

    convertDateToString(date) {
        return `d. ${date.getDate()}. ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
    }
}

function CreateButton(props) {
    return (
        <Button onClick={props.handleClick} bsStyle="primary">{strings.createBookingModal.save}</Button>
    )
}

function EditButton(props) {
    return (
        <Button onClick={props.handleClick} bsStyle="primary">{strings.createBookingModal.confirmEdit}</Button>
    )
}

class HourTimePicker extends React.Component {
    render() {
        let hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        let selectOptions = hours.map((hour) => {
            return (
                <option key={hour} value={hour}>{(hour >= 10) ? hour : '0' + hour}</option>
            )
        });

        return (
            <select className="hourPicker" value={this.props.hour} onChange={this.props.handleChange}>
                {selectOptions}
            </select>
        )
    }
}

class MinuteTimePicker extends React.Component {
    render() {
        let minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        let selectOptions = minutes.map((minute) => {
            return (
                <option key={minute} value={minute}>{(minute >= 10) ? minute : '0' + minute}</option>
            )
        });
        return (
            <select className="minutePicker" value={this.props.minutes} onChange={this.props.handleChange}>
                {selectOptions}
            </select>
        )
    }
}

// TODO evt. giv overblik over dagen

export default CreateBookingModal;