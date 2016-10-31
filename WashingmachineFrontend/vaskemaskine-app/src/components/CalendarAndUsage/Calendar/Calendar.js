import './Calendar.css';
import React from 'react';
import {monthNamesShort, weekdayNames} from '../../../commons/util';
import {Modal} from 'react-bootstrap';
import strings from '../../../strings';

class Calendar extends React.Component {
    render() {
        let weeks = this.props.weeks.map((week) => {
                return (
                    <Week key={week.weekOfCalendar} week={week} currentlySelectedMonth={this.props.month} onDayClick={this.props.onDayClick} />
                )
            }
        );

        return (
            <div className="calendar">
                {weeks}
            </div>
        )
    }
}

class Week extends React.Component {
    render() {
        let daysOfWeek = this.props.week.days.map((date) => {
            let keyForDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            // Check if we're in the first week, since we will add weekday names
            if (this.props.week.weekOfCalendar === 1) {
                let dayOfTheWeek = weekdayNames[new Date(date.getFullYear(), date.getMonth(), date.getDate()).getUTCDay()];

                // First week offmonth-days
                if (this.props.currentlySelectedMonth !== date.getMonth()) {
                    return <Day key={keyForDate} date={date} offMonthDay={true} onClick={this.props.onDayClick}>{`${dayOfTheWeek} ${date.getDate()}`}</Day>
                }

                // First week, regular days
                // Check if the first day of month, since we will add month rather than weekday
                if (date.getDate() === 1) {
                    return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{`${monthNamesShort[date.getMonth()]} ${date.getDate()}`}</Day>
                }

                return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{`${dayOfTheWeek} ${date.getDate()}`}</Day>
            }

            // Not in first week
            // Check if we're in an off-month
            if (this.props.currentlySelectedMonth !== date.getMonth()) {
                if (date.getDate() === 1) {
                    return <Day key={keyForDate} date={date} offMonthDay={true} onClick={this.props.onDayClick}>{`${monthNamesShort[date.getMonth()]} ${date.getDate()}`}</Day>
                }
                return <Day key={keyForDate} date={date} offMonthDay={true} onClick={this.props.onDayClick}>{date.getDate()}</Day>
            }

            // Else we're in a regular month
            if (date.getDate() === 1) {
                return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{`${monthNamesShort[date.getMonth()]} ${date.getDate()}`}</Day>
            }
            return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{date.getDate()}</Day>
        });

        return (
            <div className="week row seven-cols">
                {daysOfWeek}
            </div>
        )
    }
}

class CreateBookingModal extends React.Component {
    constructor(props) {
        super(props);
        this.setState({showModal: false});
    }

    render() {
        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>{strings.createBookingModal.title}</Modal.Title>
                </Modal.Header>
            </Modal.Dialog>
        )
    }
}

function Day(props) {
    let classes = "col-md-1 day ";
    let today = new Date();
    if (props.offMonthDay === true) {
        classes += "off-month-day "
    }

    if (props.date.getFullYear() === today.getFullYear() && props.date.getMonth() === today.getMonth() && props.date.getDate() === today.getDate()) {
        classes += "today "
    }

    return (
        <div onClick={() => props.onClick(props.date)} className={classes}>
            {props.children}
        </div>
    )
}


// push events live :D ? lav en lytter der sidder og kigger hele tiden
// evt. nye år

export default Calendar;