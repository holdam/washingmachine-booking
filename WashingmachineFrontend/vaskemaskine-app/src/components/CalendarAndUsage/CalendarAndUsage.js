import React from 'react';
import Calendar from './Calendar/Calendar';
import Usage from './Usage/Usage';
import MonthPicker from './Monthpicker/Monthpicker';
import './CalendarAndUsage.css';

class WeekRepresentation {
    constructor(days, weekOfCalendar) {
        this.days = days;
        this.weekOfCalendar = weekOfCalendar;
    }
}

class CalendarAndUsage extends React.Component {
    constructor(props) {
        super(props);
        this.fetchBookings = this.fetchBookings.bind(this);
        this.fetchBookings(props.selectedMonth.getFullYear(), props.selectedMonth.getMonth());
    }

    componentWillReceiveProps(nextProps) {
        // Fetch data if we are in a new month
        if (this.props.selectedMonth.getMonth() !== nextProps.selectedMonth.getMonth()) {
            this.fetchBookings(nextProps.selectedMonth.getFullYear(), nextProps.selectedMonth.getMonth());
        }
    }

    fetchBookings(year, month) {
        let weeks = this.getWeeksOfMonth(year, month);
        let firstDayOfWeeks = weeks[0].days[0];
        let lastDayOfWeeks = weeks[5].days[6];
        lastDayOfWeeks.setHours(23);
        lastDayOfWeeks.setMinutes(59);
        this.props.fetchBookings(firstDayOfWeeks.getTime(), lastDayOfWeeks.getTime());
    }

    getWeeksOfMonth(year, month) {
        let weeks = [];
        let thisMonth = new Date(year, month + 1, 0);
        let lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 0);

        // Handling first week
        let firstDayOfWeekOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).getUTCDay();
        let firstWeek = new WeekRepresentation([], 1);

        // Days of previous month we want in the beginning of our week
        for (var weekday = 1; weekday <= firstDayOfWeekOfMonth; weekday++) {
            let theDate = lastMonth.getDate() - (firstDayOfWeekOfMonth - weekday);
            firstWeek.days.push(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), theDate));
        }

        // Days of current month, fill out the week with current days of the month
        for (let i = 1; weekday <= 7; weekday++) {
            firstWeek.days.push(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), i++));
        }

        weeks.push(firstWeek);

        // Get next day of month after the first week and iterate until the end of the month
        let currentWeek = 0;
        for (let currentDay = firstWeek.days[6].getDate() + 1; currentDay <= thisMonth.getDate(); currentDay++) {
            // First day of week
            if ((currentDay - (firstWeek.days[6].getDate() + 1)) % 7 === 0) {
                currentWeek++;
                weeks.push(new WeekRepresentation([new Date(thisMonth.getFullYear(), thisMonth.getMonth(), currentDay)], currentWeek + 1));
                continue;
            }
            weeks[currentWeek].days.push(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), currentDay));
        }

        // Pad last week
        let lastDayInsertedIntoCurrentWeek = weeks[currentWeek].days[weeks[currentWeek].days.length - 1].getDate();
        let lastWeekdayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), lastDayInsertedIntoCurrentWeek).getUTCDay();
        let nextMonth = (thisMonth.getMonth() + 1) % 12;
        let nextYear = (nextMonth === 0) ? thisMonth.getFullYear() + 1 : thisMonth.getFullYear();
        for (var currentDayOfMonth = 1; lastWeekdayOfMonth + 1 < 7; lastWeekdayOfMonth++) {
            weeks[currentWeek].days.push(new Date(nextYear, nextMonth, currentDayOfMonth++));
        }

        // Make sure we have 6 weeks
        if (weeks.length < 6) {
            weeks.push(new WeekRepresentation([], 6));
            for (let lastDayOfWeek = currentDayOfMonth + 7; currentDayOfMonth < lastDayOfWeek; currentDayOfMonth++) {
                weeks[5].days.push(new Date(nextYear, nextMonth, currentDayOfMonth));
            }
        }

        return weeks;
    }

    render() {
        let weeks = this.getWeeksOfMonth(this.props.selectedMonth.getFullYear(), this.props.selectedMonth.getMonth());

        return (
            <div className="calendarAndUsage">
                <MonthPicker month={this.props.selectedMonth.getMonth()}
                             year={this.props.selectedMonth.getFullYear()}
                             dayRangeStart={weeks[0].days[0]}
                             dayRangeEnd={weeks[5].days[6]}
                             currentMonth={this.props.currentMonth}
                />
                <div className="row">
                    <Usage />
                    <div className="col-md-6">
                        <Calendar month={this.props.selectedMonth.getMonth()}
                                  year={this.props.selectedMonth.getFullYear()}
                                  weeks={weeks}
                                  bookingDate={this.props.bookingDate}
                                  bookings={this.props.bookings}
                                  showBookingModal={this.props.showBookingModal}
                                  onCreateBooking={this.props.onCreateBooking}
                                  onCancelBookingCreation={this.props.onCancelBookingCreation}
                                  isLoggedIn={this.props.isLoggedIn}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default CalendarAndUsage;
