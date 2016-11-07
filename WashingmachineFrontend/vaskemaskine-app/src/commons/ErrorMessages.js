import React from 'react';
import {Alert} from 'react-bootstrap';

function ErrorMessages(props) {
    if (!props.alertVisible) {
        return (
            <span></span>
        )
    }

    let errorMessages = props.children.map((errorMessage) => {
        return (
            <li key={errorMessage}>{errorMessage}</li>
        )
    });

    return (
        <Alert bsStyle="danger">
            <ul>
                {errorMessages}
            </ul>
        </Alert>
    )
}

export default ErrorMessages;