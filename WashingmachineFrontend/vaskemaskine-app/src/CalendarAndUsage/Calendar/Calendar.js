import './Calendar.css';
import React from 'react';
import {monthNamesShort, weekdayNames} from '../../Commons/util';

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
            // Check if we're in the first week, since we will add weekday names
            if (this.props.week.weekOfCalendar === 1) {
                let dayOfTheWeek = weekdayNames[new Date(date.year, date.month, date.day).getUTCDay()];

                // First week offmonth-days
                if (this.props.currentlySelectedMonth !== date.month) {
                    return <OffMonthDay key={`${date.year}-${date.month}-${date.day}`} onDayClick={this.props.onDayClick}>{`${dayOfTheWeek} ${date.day}`}</OffMonthDay>
                }

                // First week, regular days
                // Check if the first day of month, since we will add month rather than weekday
                if (date.day === 1) {
                    return <InMonthDay key={`${date.year}-${date.month}-${date.day}`} onDayClick={this.props.onDayClick}>{`${monthNamesShort[date.month]} ${date.day}`}</InMonthDay>
                }

                return <InMonthDay key={`${date.year}-${date.month}-${date.day}`} onDayClick={this.props.onDayClick}>{`${dayOfTheWeek} ${date.day}`}</InMonthDay>
            }

            // Not in first week
            // Check if we're in an off-month
            if (this.props.currentlySelectedMonth !== date.month) {
                if (date.day === 1) {
                    return <OffMonthDay key={`${date.year}-${date.month}-${date.day}`} onDayClick={this.props.onDayClick}>{`${monthNamesShort[date.month]} ${date.day}`}</OffMonthDay>
                }
                return <OffMonthDay key={`${date.year}-${date.month}-${date.day}`} onDayClick={this.props.onDayClick}>{date.day}</OffMonthDay>
            }
            // Else we're in a regular month
            if (date.day === 1) {
                return <InMonthDay key={`${date.year}-${date.month}-${date.day}`} onDayClick={this.props.onDayClick}>{`${monthNamesShort[date.month]} ${date.day}`}</InMonthDay>
            }
            return <InMonthDay key={`${date.year}-${date.month}-${date.day}`} onDayClick={this.props.onDayClick}>{date.day}</InMonthDay>
        });

        return (
            <div className="week row seven-cols">
                {daysOfWeek}
            </div>
        )
    }
}

// TODO pass day / month as parameters instead of children

function OffMonthDay(props) {
    return (
        <div onClick={props.onDayClick()} className="col-md-1 off-month-day day">
            {props.children}
        </div>
    )
}

function InMonthDay(props) {
    return (
        <div className="col-md-1 day">
            {props.children}
        </div>
    )
}


// push events live :D ? lav en lytter der sidder og kigger hele tiden
// evt. nye år

export default Calendar;