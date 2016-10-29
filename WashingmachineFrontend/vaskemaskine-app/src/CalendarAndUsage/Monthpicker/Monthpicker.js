import {monthNames} from "../../Commons/util";
import './Monthpicker.css';
import {ButtonGroup, Button, Glyphicon} from 'react-bootstrap'
import * as React from "react";
import {monthNamesShort} from "../../Commons/util";
import {Link} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap'

class MonthPicker extends React.Component {
    render() {
        let previousMonth =  new Date(this.props.year, this.props.month - 1);
        let nextMonth =  new Date(this.props.year, this.props.month + 1);
        let previousMonthLink = `/booking/${previousMonth.getFullYear()}/${previousMonth.getMonth()}`;
        let homeLink = `/booking/${this.props.actualCurrentMonth.getFullYear()}/${this.props.actualCurrentMonth.getMonth()}`;
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