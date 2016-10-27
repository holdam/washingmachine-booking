import './Calendar.css';
import React from 'react';
import * as bootstrap from 'react-bootstrap'

class DateRepresentation {
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
}

class WeekRepresentation {
    constructor(days, weekOfCalendar) {
        this.days = days;
        this.weekOfCalendar = weekOfCalendar;
    }
}

var monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni",
    "Juli", "August", "September", "Oktober", "November", "December"
];

class CalendarMaster extends React.Component {
    render() {
        let today = new Date();
        return (
            <div className="calendar-master">
                <CalendarMonthPicker month={8} />
                <Calendar month={11} year={2016} />
            </div>
        )
    }
}

class CalendarMonthPicker extends React.Component {
    render() {
        return (
            <div>
                <span>TILBAGE</span>
                <span>{monthNames[this.props.month]}</span>
                <span>FREMAD</span>
            </div>
        )
    }
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thisMonth: new Date(this.props.year, this.props.month + 1, 0),
            lastMonth: new Date(this.props.year, this.props.month, 0)
        }
    }

    getWeeksOfMonth() {
        let weeks = [];
        let thisMonth = this.state.thisMonth;
        let lastMonth = this.state.lastMonth;

        // Handling first week
        let firstDayOfWeekOfMonth = new Date(this.props.year, this.props.month, 1).getUTCDay();
        let firstWeek = new WeekRepresentation([], 1);

        // Days of previous month we want in the beginning of our week
        for (var weekday = 1; weekday <= firstDayOfWeekOfMonth; weekday++) {
            let theDate = lastMonth.getDate() - (firstDayOfWeekOfMonth - weekday);
            firstWeek.days.push(new DateRepresentation(lastMonth.getFullYear(), lastMonth.getMonth(), theDate));
        }

        // Days of current month, fill out the week with current days of the month
        for (let i = 1; weekday <= 7; weekday++) {
            firstWeek.days.push(new DateRepresentation(thisMonth.getFullYear(), thisMonth.getMonth(), i++));
        }

        weeks.push(firstWeek);

        // Get next day of month after the first week and iterate until the end of the month
        let currentWeek = 0;
        for (let currentDay = firstWeek.days[6].day + 1; currentDay <= thisMonth.getDate(); currentDay++) {
            // First day of week
            if ((currentDay - (firstWeek.days[6].day + 1)) % 7 === 0) {
                currentWeek++;
                weeks.push(new WeekRepresentation([new DateRepresentation(thisMonth.getFullYear(), thisMonth.getMonth(), currentDay)], currentWeek + 1));
                continue;
            }
            weeks[currentWeek].days.push(new DateRepresentation(thisMonth.getFullYear(), thisMonth.getMonth(), currentDay));
        }

        // Pad last week
        let lastDayInsertedIntoCurrentWeek = weeks[currentWeek].days[weeks[currentWeek].days.length - 1].day;
        let lastWeekdayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), lastDayInsertedIntoCurrentWeek).getUTCDay();
        let nextMonth = (thisMonth.getMonth() + 1) % 12;
        let nextYear = (nextMonth === 0) ? thisMonth.getFullYear() + 1 : thisMonth.getFullYear();
        for (var currentDayOfMonth = 1; lastWeekdayOfMonth + 1 < 7; lastWeekdayOfMonth++) {
            weeks[currentWeek].days.push(new DateRepresentation(nextYear, nextMonth, currentDayOfMonth++));
        }

        // Make sure we have 6 weeks
        if (weeks.length < 6) {
            weeks.push(new WeekRepresentation([], 6));
            for (let lastDayOfWeek = currentDayOfMonth + 7; currentDayOfMonth < lastDayOfWeek; currentDayOfMonth++) {
                weeks[5].days.push(new DateRepresentation(nextYear, nextMonth, currentDayOfMonth));
            }
        }

        return weeks;
    }

    render() {
        let weeks = this.getWeeksOfMonth().map((week) => {
                return (
                    <Week key={week.weekOfCalendar} week={week} currentlySelectedMonth={this.state.thisMonth.getMonth()} />
                )
            }
        );

        return (
            <div className="calendar">
                <WeekdayNames />
                {weeks}
            </div>
        )
    }
}

class WeekdayNames extends React.Component {
    render() {
        return (
            <div className="row seven-cols weekday-names">
                <div className="col-md-1">Mandag</div>
                <div className="col-md-1">Tirsdag</div>
                <div className="col-md-1">Onsdag</div>
                <div className="col-md-1">Torsdag</div>
                <div className="col-md-1">Fredag</div>
                <div className="col-md-1">Lørdag</div>
                <div className="col-md-1">Søndag</div>
            </div>
        )
    }
}

class Week extends React.Component {
    render() {
        let daysOfWeek = this.props.week.days.map((date) => {
            if (this.props.currentlySelectedMonth !== date.month) {
                // We're in an off-month
                if (date.day === 1) {
                    return <FirstDayOfOffMonth key={`${date.year}-${date.month}-${date.day}`} month={date.month} day={date.day} />
                }
                return <OffMonthDay key={`${date.year}-${date.month}-${date.day}`} day={date.day} />
            }
            // Else regular month
            if (date.day === 1) {
                return <FirstDayOfMonth key={`${date.year}-${date.month}-${date.day}`} month={date.month} day={date.day} />
            }
            return <InMonthDay key={`${date.year}-${date.month}-${date.day}`} day={date.day} />
        });

        return (
            <div className="week row seven-cols">{daysOfWeek}</div>
        )
    }
}

function FirstDayOfOffMonth(props) {
    return (
        <div className="col-md-1 off-month-day day">{monthNames[props.month] + " " + props.day}</div>
    )
}

function OffMonthDay(props) {
    return (
        <div className="col-md-1 off-month-day day">{props.day}</div>
    )
}

function FirstDayOfMonth(props) {
    return (
        <div className="col-md-1 day">{monthNames[props.month] + " " + props.day}</div>
    )
}

function InMonthDay(props) {
    return (
        <div className="col-md-1 day">{props.day}</div>
    )
}


// TODO ugedagenavne, årsttal, månedvælger i toppen januar fucker i 2016
// evt. nye år

export default CalendarMaster;