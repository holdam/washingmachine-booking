import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import strings from '../../../../strings';
import {monthNames} from '../../../../commons/util';
import './CreateBookingModal.css';
import {ControlLabel, Form, FormGroup, Col} from "react-bootstrap";

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

        this.state = {
            startHour: 8,
            startMinute: 0,
            endHour: 8,
            endMinute: 0,
            numberOfWashings: 0,
            numberOfTumbleDries: 0
        }

    }

    handleHourStartChange(event) {
        this.setState({startHour: event.target.value});
    }

    handleMinuteStartChange(event) {
        this.setState({startMinute: event.target.value});
    }

    handleHourEndChange(event) {
        this.setState({endHour: event.target.value});
    }

    handleMinuteEndChange(event) {
        this.setState({endMinute: event.target.value});
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

        if (this.state.endHour >= 22 && this.state.endMinute > 0) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustEndBefore22);
        }

        let timeDifference = (this.state.endMinute - this.state.startMinute >= 0)
            ? {hour: (this.state.endHour - this.state.startHour), minutes: (this.state.endMinute - this.state.startMinute)}
            : {hour: (this.state.endHour - this.state.startHour - 1), minutes: (60 - (this.state.startMinute + this.state.endMinute))};

        if (timeDifference.hour < 0 || (timeDifference.hour <= 0 && timeDifference.minutes < 30)) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustReserveAtLeast30Minutes);
        }

        if (this.state.numberOfWashings <= 0 && this.state.numberOfTumbleDries <= 0) {
            errorMessages.push(strings.createBookingModal.errorsMessages.mustReserveEitherTumbleDrierOrWashingMachine);
        }

        console.log(this.props.bookings);
        console.log(this.state);
        console.log(errorMessages);

        // TODO validation -  ikke clasher

        //this.props.onCreateBooking(123, 123, 123)
    }

    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.props.onCancelBookingCreation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${strings.createBookingModal.title} ${this.convertDateToString((this.props.bookingDate || new Date()))}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup controlId="formStartTime">
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.createBookingModal.startTime}
                            </Col>
                            <Col sm={8}>
                                <div>
                                    <HourTimePicker handleChange={this.handleHourStartChange} />
                                    <MinuteTimePicker handleChange={this.handleMinuteStartChange} />
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formEndTime">
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.createBookingModal.endTime}
                            </Col>
                            <Col sm={8}>
                                <div>
                                    <HourTimePicker handleChange={this.handleHourEndChange} />
                                    <MinuteTimePicker handleChange={this.handleMinuteEndChange} />
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.createBookingModal.numberOfWashes}
                            </Col>
                            <Col sm={8}>
                                <input onChange={this.handleNumberOfWashingsChange} className="numberOfWashingsPicker" defaultValue={0} type="number" min="0" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                {strings.createBookingModal.numberOfTumbleDries}
                            </Col>
                            <Col sm={8}>
                                <input onChange={this.handleNumberOfTumbleDriesChange} className="numberOfTumbleDriesPicker" defaultValue={0} type="number" min="0" />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onCancelBookingCreation}>{strings.createBookingModal.cancel}</Button>
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
    // todo perhaps try and limit minutes to 0 when 22 chosen, med 05-55 greydd out

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


// TODO
// need to change backend to take number of washes
// mulighed for at vælge hvor mange vask
// slet booking / rediger hvis klikker på allerede oprettet
// evt. giv overblik over dagen
// skriv at antallet af gange siger hvor meget der skal betales

export default CreateBookingModal;