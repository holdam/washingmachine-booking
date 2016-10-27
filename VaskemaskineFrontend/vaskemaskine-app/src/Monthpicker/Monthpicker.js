import {monthNames} from "../Commons/util";
import './Monthpicker.css';
import {ButtonGroup, Button, Glyphicon} from 'react-bootstrap'
import * as React from "react";

class MonthPicker extends React.Component {
    render() {
        return (
            <div id="month-picker" className="month-picker">
                <ButtonGroup>
                    <Button>
                        <Glyphicon glyph="glyphicon glyphicon-chevron-left" />
                    </Button>
                    <Button>{monthNames[this.props.month]}</Button>
                    <Button>
                        <Glyphicon glyph="glyphicon glyphicon-chevron-right" />
                    </Button>
                </ButtonGroup>
                <div className="date-range">
                    
                </div>
            </div>
        )
    }
}

export default MonthPicker;