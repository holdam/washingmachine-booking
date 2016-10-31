import './Calendar.css';
import React from 'react';
import {monthNamesShort, weekdayNames} from '../../../commons/util';

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
        // Someone more smart than me should rewrite this shit, to avoid creating the same almost identical element 3 x 2 times.
        let daysOfWeek = this.props.week.days.map((date) => {
            let keyForDate = `${date.year}-${date.month}-${date.day}`;

            // Check if we're in the first week, since we will add weekday names
            if (this.props.week.weekOfCalendar === 1) {
                let dayOfTheWeek = weekdayNames[new Date(date.year, date.month, date.day).getUTCDay()];

                // First week offmonth-days
                if (this.props.currentlySelectedMonth !== date.month) {
                    return <Day key={keyForDate} date={date} offMonthDay={true} onClick={this.props.onDayClick}>{`${dayOfTheWeek} ${date.day}`}</Day>
                }

                // First week, regular days
                // Check if the first day of month, since we will add month rather than weekday
                if (date.day === 1) {
                    return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{`${monthNamesShort[date.month]} ${date.day}`}</Day>
                }

                return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{`${dayOfTheWeek} ${date.day}`}</Day>
            }

            // Not in first week
            // Check if we're in an off-month
            if (this.props.currentlySelectedMonth !== date.month) {
                if (date.day === 1) {
                    return <Day key={keyForDate} date={date} offMonthDay={true} onClick={this.props.onDayClick}>{`${monthNamesShort[date.month]} ${date.day}`}</Day>
                }
                return <Day key={keyForDate} date={date} offMonthDay={true} onClick={this.props.onDayClick}>{date.day}</Day>
            }

            // Else we're in a regular month
            if (date.day === 1) {
                return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{`${monthNamesShort[date.month]} ${date.day}`}</Day>
            }
            return <Day key={keyForDate} date={date} onClick={this.props.onDayClick}>{date.day}</Day>
        });

        return (
            <div className="week row seven-cols">
                {daysOfWeek}
            </div>
        )
    }
}

function Day(props) {
    let classes = "col-md-1 day ";
    let today = new Date();
    if (props.offMonthDay === true) {
        classes += "off-month-day "
    }
    if (props.date.year === today.getFullYear() && props.date.month === today.getMonth() && props.date.day === today.getDate()) {
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