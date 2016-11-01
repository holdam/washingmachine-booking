import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import strings from '../../../../strings';
import {convertDateToString} from '../../../../commons/util';

class CreateBookingModal extends React.Component {
    render() {
        return (
            <Modal show={this.props.showModal}>
                <Modal.Header>
                    <Modal.Title>{`${strings.createBookingModal.title} ${convertDateToString((this.props.bookingDate || new Date()))}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {strings.createBookingModal.body}
                </Modal.Body>
                <Modal.Footer>
                    {/* TODO */}
                    <Button onClick={this.props.onCancelBookingCreation}>{strings.createBookingModal.cancel}</Button>
                    <Button onClick={() => this.props.onCreateBooking(123, 123, 123)} bsStyle="primary">{strings.createBookingModal.save}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default CreateBookingModal;