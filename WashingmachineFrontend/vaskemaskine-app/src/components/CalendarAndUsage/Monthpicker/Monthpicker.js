import './Monthpicker.css';
import {ButtonGroup, Button, Glyphicon} from 'react-bootstrap'
import * as React from "react";
import {monthNamesShort, monthNames} from "../../../commons/util";
import {LinkContainer} from 'react-router-bootstrap'

class MonthPicker extends React.Component {
    render() {
        console.log(this.props)
        let previousMonth =  new Date(this.props.year, this.props.month - 1);
        let nextMonth =  new Date(this.props.year, this.props.month + 1);
        let previousMonthLink = `/booking/${previousMonth.getFullYear()}/${previousMonth.getMonth()}`;
        let homeLink = `/booking/${this.props.currentMonth.getFullYear()}/${this.props.currentMonth.getMonth()}`;
        let nextMonthLink = `/booking/${nextMonth.getFullYear()}/${nextMonth.getMonth()}`;

        return (
            <div className="topbar">
                <ButtonGroup className="month-picker">
                    <LinkContainer to={{pathname: previousMonthLink}} >
                        <Button>
                            <Glyphicon glyph="glyphicon glyphicon-chevron-left"/>
                        </Button>
                    </LinkContainer>
                    <LinkContainer to={{pathname: homeLink}}>
                        <Button>
                            <Glyphicon glyph="glyphicon glyphicon-home" />
                        </Button>
                    </LinkContainer>
                    <Button className="month-name">{monthNames[this.props.month]}</Button>
                    <LinkContainer to={{pathname: nextMonthLink}}>
                        <Button>
                            <Glyphicon glyph="glyphicon glyphicon-chevron-right"/>
                        </Button>
                    </LinkContainer>
                </ButtonGroup>
                <div className="date-range">
                    <FormatDateForRange day={this.props.dayRangeStart.getDate()} month={this.props.dayRangeStart.getMonth()} year={this.props.dayRangeStart.getFullYear()} />
                    <span> - </span>
                    <FormatDateForRange day={this.props.dayRangeEnd.getDate()} month={this.props.dayRangeEnd.getMonth()} year={this.props.dayRangeEnd.getFullYear()} />
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