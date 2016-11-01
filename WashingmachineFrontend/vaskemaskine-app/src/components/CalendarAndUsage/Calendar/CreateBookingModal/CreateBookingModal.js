import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import strings from '../../../../strings';
import {monthNames} from '../../../../commons/util';
import './CreateBookingModal.css';
import {ControlLabel, Form, FormGroup, Col} from "react-bootstrap";

class CreateBookingModal extends React.Component {
    // TODO validation - skal slutte før 22, skal være mindst 0,5 time?

    constructor(props) {
        super(props);
        this.handleHourStartChange = this.handleHourStartChange.bind(this);
        this.handleMinuteStartChange = this.handleMinuteStartChange.bind(this);
        this.handleHourEndChange = this.handleHourEndChange.bind(this);
        this.handleMinuteEndChange = this.handleMinuteEndChange.bind(this);
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

    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.props.onCancelBookingCreation}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${strings.createBookingModal.title} ${this.convertDateToString((this.props.bookingDate || new Date()))}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                                    <MinuteTimePicker handleChange={this.handleMinuteStartChange} />
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {/* TODO */}
                    <Button onClick={this.props.onCancelBookingCreation}>{strings.createBookingModal.cancel}</Button>
                    <Button onClick={() => this.props.onCreateBooking(123, 123, 123)} bsStyle="primary">{strings.createBookingModal.save}</Button>
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


// TODO
// mulighed for at vælge hvor mange vask
// slet booking / rediger

export default CreateBookingModal;