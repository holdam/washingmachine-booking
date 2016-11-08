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
        this.cancelBookingCreation = this.cancelBookingCreation.bind(this);

        this.state = {
            startHour: 8,
            startMinutes: 0,
            endHours: 8,
            endMinutes: 0,
            numberOfWashings: 0,
            numberOfTumbleDries: 0,
            errorMessages: []
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
        this.setState({numberOfWashings: event.target.value});
    }

    handleNumberOfTumbleDriesChange(event) {
        this.setState({numberOfTumbleDries: event.target.value});
    }

    handleCreateBooking() {
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

        if (this.state.numberOfWashings <= 0 && this.state.numberOfTumbleDries <= 0) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustReserveEitherTumbleDrierOrWashingMachine);
        }

        let startTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        startTimeOfNewBooking.setHours(this.state.startHour);
        startTimeOfNewBooking.setMinutes(this.state.startMinutes);

        let endTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        endTimeOfNewBooking.setHours(this.state.endHours);
        endTimeOfNewBooking.setMinutes(this.state.endMinutes);

        for (let booking of this.props.bookings) {
            if (booking.startTime < endTimeOfNewBooking.getTime() && booking.endTime > startTimeOfNewBooking.getTime()) {
                errorMessages.push(strings.createBookingModal.errorsMessages.bookingIsClashing);
            }
        }

        if (!this.props.isLoggedIn) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustBeLoggedIn);
        }

        this.setState({
            errorMessages
        });

        if (errorMessages.length === 0) {
            this.props.onCreateBooking(startTimeOfNewBooking.getTime(), endTimeOfNewBooking.getTime(),
                this.state.numberOfWashings, this.state.numberOfTumbleDries);
        }
    }

    cancelBookingCreation() {
        // Clear error messages when closing modal
        this.setState({
            errorMessages: []
        });

        this.props.onCancelBookingCreation();
    }

    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.cancelBookingCreation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${strings.createBookingModal.title} ${this.convertDateToString((this.props.bookingDate || new Date()))}`}</Modal.Title>
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
                                    <HourTimePicker handleChange={this.handleHourStartChange} />
                                    <MinuteTimePicker handleChange={this.handleMinuteStartChange} />
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formEndTime">
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.createBookingModal.endTime}
                            </Col>
                            <Col sm={7}>
                                <div>
                                    <HourTimePicker handleChange={this.handleHourEndChange} />
                                    <MinuteTimePicker handleChange={this.handleMinuteEndChange} />
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.createBookingModal.numberOfWashes}
                            </Col>
                            <Col sm={7}>
                                <input onChange={this.handleNumberOfWashingsChange} className="numberOfWashingsPicker" defaultValue={0} type="number" min="0" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.createBookingModal.numberOfTumbleDries}
                            </Col>
                            <Col sm={7}>
                                <input onChange={this.handleNumberOfTumbleDriesChange} className="numberOfTumbleDriesPicker" defaultValue={0} type="number" min="0" />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.cancelBookingCreation}>{strings.createBookingModal.cancel}</Button>
                    <Button onClick={this.handleCreateBooking} bsStyle="primary">{strings.createBookingModal.save}</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    convertDateToString(date) {
        return `d. ${date.getDate()}. ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
    }
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
            <select className="hourPicker" defaultValue={8} onChange={this.props.handleChange}>
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
            <select className="minutePicker" defaultValue={0} onChange={this.props.handleChange}>
                {selectOptions}
            </select>
        )
    }
}

// TODO evt. giv overblik over dagen

export default CreateBookingModal;