import React from 'react';
import {Alert} from 'react-bootstrap';
import strings from '../../../commons/strings';
import './GlobalErrorMessage.css';

function GlobalErrorMessage(props) {
    return (
        <div className="globalErrorMessage">
            <Alert bsStyle="danger">
                <h4>{strings.misc.globalErrorMessages.error}</h4>
                <p>{props.errorMessage}</p>
            </Alert>
        </div>
    )
}

export default GlobalErrorMessage;