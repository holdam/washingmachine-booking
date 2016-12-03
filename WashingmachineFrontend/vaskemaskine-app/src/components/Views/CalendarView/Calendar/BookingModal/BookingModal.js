import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import strings from '../../../../../commons/strings';
import {monthNames} from '../../../../../commons/util';
import './BookingModal.css';
import {ControlLabel, Form, FormGroup, Col} from "react-bootstrap";
import ErrorMessages from '../../../../../commons/ErrorMessages';
import {getBookingsOfDate, getPrettyStartEndHoursAndMinutesFromBooking} from '../../../../../commons/util'

class BookingModal extends React.Component {
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
        this.commonValidations = this.commonValidations.bind(this);
        this.handleDeleteBooking = this.handleDeleteBooking.bind(this);
        this.resetState = this.resetState.bind(this);

        this.state = {
            startHour: 8,
            startMinutes: 0,
            endHours: 8,
            endMinutes: 0,
            numberOfWashingMachineUses: 0,
            numberOfTumbleDryUses: 0,
            errorMessages: []
        }
    }

    componentWillReceiveProps(nextProps) {
        // Load values if passed
        if (nextProps.isEditMode) {
            let startDate = new Date(nextProps.editBookingProps.startTime);
            let endDate = new Date(nextProps.editBookingProps.endTime);

            this.setState({
                startHour: startDate.getHours(),
                startMinutes: startDate.getMinutes(),
                endHours: endDate.getHours(),
                endMinutes: endDate.getMinutes(),
                numberOfWashingMachineUses: nextProps.editBookingProps.numberOfWashingMachineUses,
                numberOfTumbleDryUses: nextProps.editBookingProps.numberOfTumbleDryUses
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
        let errorMessages = this.commonValidations();

        if (this.props.bookingDate < new Date()) {
            errorMessages.push(strings.bookingModal.errorsMessages.dayIsBeforeToday);
        }

        this.setState({
            errorMessages
        });

        if (errorMessages.length === 0) {
            let startTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
            startTimeOfNewBooking.setHours(this.state.startHour);
            startTimeOfNewBooking.setMinutes(this.state.startMinutes);

            let endTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
            endTimeOfNewBooking.setHours(this.state.endHours);
            endTimeOfNewBooking.setMinutes(this.state.endMinutes);

            this.resetState();
            this.props.onCreateBooking(startTimeOfNewBooking.getTime(), endTimeOfNewBooking.getTime(),
                this.state.numberOfWashingMachineUses, this.state.numberOfTumbleDryUses);
        }
    }

    handleEditBooking() {
        let errorMessages = this.commonValidations();

        this.setState({
            errorMessages
        });

        if (errorMessages.length === 0) {
            let startTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
            startTimeOfNewBooking.setHours(this.state.startHour);
            startTimeOfNewBooking.setMinutes(this.state.startMinutes);

            let endTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
            endTimeOfNewBooking.setHours(this.state.endHours);
            endTimeOfNewBooking.setMinutes(this.state.endMinutes);

            this.resetState();
            this.props.onEditBooking(this.props.editBookingProps.id, startTimeOfNewBooking.getTime(), endTimeOfNewBooking.getTime(),
                this.state.numberOfWashingMachineUses, this.state.numberOfTumbleDryUses);
        }
    }

    handleDeleteBooking() {
        let confirmation = window.confirm(strings.bookingModal.confirmDeletion);
        if (confirmation) {
            this.resetState();
            this.props.onDeleteBooking(this.props.editBookingProps.id);
        }
    }

    commonValidations() {
        // Validations
        let errorMessages = [];

        if (this.state.endHours >= 22 && this.state.endMinutes > 0) {
            errorMessages.push(strings.bookingModal.errorsMessages.mustEndBefore22);
        }

        let timeDifference = (this.state.endMinutes - this.state.startMinutes >= 0)
            ? {hour: (this.state.endHours - this.state.startHour), minutes: (this.state.endMinutes - this.state.startMinutes)}
            : {hour: (this.state.endHours - this.state.startHour - 1), minutes: (60 - (this.state.startMinutes + this.state.endMinutes))};

        if (timeDifference.hour < 0 || (timeDifference.hour <= 0 && timeDifference.minutes < 30)) {
            errorMessages.push(strings.bookingModal.errorsMessages.mustReserveAtLeast30Minutes);
        }

        if (this.state.numberOfWashingMachineUses <= 0 && this.state.numberOfTumbleDryUses <= 0) {
            errorMessages.push(strings.bookingModal.errorsMessages.mustReserveEitherTumbleDrierOrWashingMachine);
        }

        let startTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        startTimeOfNewBooking.setHours(this.state.startHour);
        startTimeOfNewBooking.setMinutes(this.state.startMinutes);

        let endTimeOfNewBooking = new Date(this.props.bookingDate.getTime());
        endTimeOfNewBooking.setHours(this.state.endHours);
        endTimeOfNewBooking.setMinutes(this.state.endMinutes);

        for (let booking of this.props.bookings) {
            if (booking.startTime < endTimeOfNewBooking.getTime() && booking.endTime > startTimeOfNewBooking.getTime() && booking.id !== this.props.editBookingProps.id) {
                errorMessages.push(strings.bookingModal.errorsMessages.bookingIsClashing);
            }
        }

        if (!this.props.isLoggedIn) {
            errorMessages.push(strings.bookingModal.errorsMessages.mustBeLoggedIn);
        }

        return errorMessages;
    }

    resetState() {
        this.setState({
            startHour: 8,
            startMinutes: 0,
            endHours: 8,
            endMinutes: 0,
            numberOfWashingMachineUses: 0,
            numberOfTumbleDryUses: 0,
            errorMessages: []
        });
    }

    cancelBooking() {
        this.resetState();
        this.props.onCancelBookingCreation();
        this.props.onCancelEditBookingCreation();
    }

    render() {
        const createOrEditButton = (this.props.isEditMode)
            ? <EditButton handleClick={this.handleEditBooking} />
            : <CreateButton handleClick={this.handleCreateBooking} />;

        const title = `${this.props.isEditMode ? strings.bookingModal.titleEdit : strings.bookingModal.titleCreate} ${this.convertDateToString((this.props.bookingDate || new Date()))}`;

        return (
            <Modal show={this.props.showModal} onHide={this.cancelBooking}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ErrorMessages alertVisible={this.state.errorMessages.length > 0}>
                        {this.state.errorMessages}
                    </ErrorMessages>
                    <Form horizontal>
                        <FormGroup controlId="formStartTime">
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.bookingModal.startTime}
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
                                {strings.bookingModal.endTime}
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
                                {strings.bookingModal.numberOfWashes}
                            </Col>
                            <Col sm={7}>
                                <input onChange={this.handleNumberOfWashingsChange} className="numberOfWashingsPicker" value={this.state.numberOfWashingMachineUses} type="number" min="0" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={5}>
                                {strings.bookingModal.numberOfTumbleDries}
                            </Col>
                            <Col sm={7}>
                                <input onChange={this.handleNumberOfTumbleDriesChange} className="numberOfTumbleDryPicker" value={this.state.numberOfTumbleDryUses} type="number" min="0" />
                            </Col>
                        </FormGroup>
                    </Form>
                    <CurrentBookingOverview bookings={getBookingsOfDate(this.props.bookings, this.props.bookingDate)} />
                </Modal.Body>
                <Modal.Footer>
                    {this.props.isEditMode ? <Button className="deleteButton" bsStyle="danger" onClick={this.handleDeleteBooking}>{strings.bookingModal.delete}</Button> : null}
                    <Button onClick={this.cancelBooking}>{strings.bookingModal.cancel}</Button>
                    {createOrEditButton}
                </Modal.Footer>
            </Modal>
        )
    }

    convertDateToString(date) {
        return `d. ${date.getDate()}. ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
    }
}

const CurrentBookingOverview = (props) => {
    const bookings = props.bookings.map((booking) => {
        let startHour, startMinutes, endHour, endMinutes;
        ({startHour, startMinutes, endHour, endMinutes} = getPrettyStartEndHoursAndMinutesFromBooking(booking));
        return (
            <div className="booking-of-selected-day" key={`${startHour}${startMinutes}`}>
                <span>{booking.owner}: </span>
                <span>{`${startHour}:${startMinutes} - ${endHour}:${endMinutes}`}</span>
            </div>
        )
    });

    let bookingsForInsertion;
    if (props.bookings.length > 0) {
        bookingsForInsertion = (
            <div className="list-of-bookings">
                {bookings}
            </div>
        )
    } else {
        bookingsForInsertion = (
            <p>{strings.bookingModal.noBookingsAsOfYet}</p>
        )
    }

    return (
        <div className="current-bookings">
            <h4>{strings.bookingModal.daysCurrentBookings}</h4>
            {bookingsForInsertion}
        </div>
    )
};

const CreateButton = (props) => {
    return (
        <Button onClick={props.handleClick} bsStyle="primary">{strings.bookingModal.save}</Button>
    )
};

const EditButton = (props) => {
    return (
        <Button onClick={props.handleClick} bsStyle="primary">{strings.bookingModal.confirmEdit}</Button>
    )
};

const HourTimePicker = (props) => {
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    const selectOptions = hours.map((hour) => {
        return (
            <option key={hour} value={hour}>{(hour >= 10) ? hour : '0' + hour}</option>
        )
    });

    return (
        <select className="hourPicker" value={props.hour} onChange={props.handleChange}>
            {selectOptions}
        </select>
    )
};

const MinuteTimePicker = (props) => {

    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const selectOptions = minutes.map((minute) => {
        return (
            <option key={minute} value={minute}>{(minute >= 10) ? minute : '0' + minute}</option>
        )
    });
    return (
        <select className="minutePicker" value={props.minutes} onChange={props.handleChange}>
            {selectOptions}
        </select>
    )
};


export default BookingModal;