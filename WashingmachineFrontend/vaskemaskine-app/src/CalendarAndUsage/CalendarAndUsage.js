import React from 'react';
import Calendar from './Calendar/Calendar';
import Usage from './Usage/Usage';
import MonthPicker from './Monthpicker/Monthpicker';
import './CalendarAndUsage.css';

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

class CalendarAndUsage extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickOnDay = this.handleClickOnDay.bind(this);

        let actualCurrentMonth = new Date();
        let selectedMonth = actualCurrentMonth;

        // We were passed params initially
        if (props.params.year && props.params.month) {
            selectedMonth = new Date(props.params.year, props.params.month);
        }

        this.state = {
            selectedMonth: selectedMonth,
            actualCurrentMonth: actualCurrentMonth
        };
    }

    componentWillReceiveProps(nextProps) {
        let selectedMonth = new Date(nextProps.params.year, nextProps.params.month);
        this.setState({
            selectedMonth: new Date(selectedMonth.getFullYear(), selectedMonth.getMonth())
        });
    }

    getBookingInformation(year, month) {

    }

    handleClickOnDay(date) {
        console.log(date)
        console.log("wtf");
    }

    getWeeksOfMonth() {
        let weeks = [];
        let thisMonth = new Date(this.state.selectedMonth.getFullYear(), this.state.selectedMonth.getMonth() + 1, 0);
        let lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 0);

        // Handling first week
        let firstDayOfWeekOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).getUTCDay();
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
        let weeks = this.getWeeksOfMonth();
        return (
            <div className="calendarAndUsage">
                <MonthPicker month={this.state.selectedMonth.getMonth()} year={this.state.selectedMonth.getFullYear()}
                             dayRangeStart={weeks[0].days[0]} dayRangeEnd={weeks[5].days[6]}
                             actualCurrentMonth={this.state.actualCurrentMonth} />
                <div className="row">
                    <Usage />
                    <div className="col-md-6">
                        <Calendar month={this.state.selectedMonth.getMonth()} weeks={weeks} year={this.state.selectedMonth.getFullYear()}
                                  onDayClick={this.handleClickOnDay} />
                    </div>
                </div>
            </div>
        )
    }
}

export default CalendarAndUsage;