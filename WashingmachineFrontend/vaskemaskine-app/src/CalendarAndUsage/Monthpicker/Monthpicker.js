import {monthNames} from "../../Commons/util";
import './Monthpicker.css';
import {ButtonGroup, Button, Glyphicon} from 'react-bootstrap'
import * as React from "react";
import {monthNamesShort} from "../../Commons/util";

class MonthPicker extends React.Component {
    render() {
        return (
            <div className="topbar">
                <ButtonGroup className="month-picker">
                    <Button onClick={() => this.props.onPreviousMonthClick()}>
                        <Glyphicon glyph="glyphicon glyphicon-chevron-left" />
                    </Button>
                    <Button onClick={() => this.props.onHomeClick()}>
                        <Glyphicon glyph="glyphicon glyphicon-home" />
                    </Button>
                    <Button className="month-name">{monthNames[this.props.month]}</Button>
                    <Button onClick={() => this.props.onNextMonthClick()}>
                        <Glyphicon glyph="glyphicon glyphicon-chevron-right" />
                    </Button>
                </ButtonGroup>
                <div className="date-range">
                    <FormatDateForRange day={this.props.dayRangeStart.day} month={this.props.dayRangeStart.month} year={this.props.dayRangeStart.year} />
                    <span> - </span>
                    <FormatDateForRange day={this.props.dayRangeEnd.day} month={this.props.dayRangeEnd.month} year={this.props.dayRangeEnd.year} />
                </div>
            </div>
        )
    }
}

function FormatDateForRange(props) {
    return (
        <span>{`${props.day} ${monthNamesShort[props.month]}, ${props.year}`}</span>
    )
}

export default MonthPicker;