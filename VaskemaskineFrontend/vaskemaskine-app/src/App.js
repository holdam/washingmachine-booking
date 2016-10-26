import React, { Component } from 'react';
import logo from './logo.svg';
import * as bootstrap from 'react-bootstrap'
import './App.css';

class App extends Component {
    render() {
        let today = new Date();
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <Calendar month={8} year={today.getFullYear()} />
            </div>
        );
    }
}
// <Calendar month={today.getMonth()} year={today.getFullYear()} />

class Calendar extends React.Component {
    render() {
        let weeks = [];
        let thisMonth = new Date(this.props.year, this.props.month + 1, 0);
        let lastMonth = new Date(this.props.year, this.props.month, 0);

        // Handling first week
        let firstDayOfWeekOfMonth = new Date(this.props.year, this.props.month, 1).getUTCDay();
        let firstWeek = [];

        // Day is of previous month
        for (var weekday = 1; weekday <= firstDayOfWeekOfMonth; weekday++) {
            let theDate = lastMonth.getDate() - (firstDayOfWeekOfMonth - weekday);
            firstWeek.push(new DateRepresentation(lastMonth.getFullYear(), lastMonth.getMonth(), theDate));
        }

        // Day is of current month, fill out the week with current days of the month
        for (let i = 1; weekday <= 7; weekday++) {
            firstWeek.push(new DateRepresentation(thisMonth.getFullYear(), thisMonth.getMonth(), i++));
        }

        weeks.push(firstWeek);

        // Get next day of month after the first week and iterate until the end of the month
        let currentWeek = 0;
        for (let currentDay = firstWeek[6].day + 1; currentDay <= thisMonth.getDate(); currentDay++) {
            if ((currentDay - (firstWeek[6].day + 1)) % 7 == 0) {
                weeks.push([new DateRepresentation(thisMonth.getFullYear(), thisMonth.getMonth(), currentDay)]);
                currentWeek++;
                continue;
            }
            weeks[currentWeek].push(new DateRepresentation(thisMonth.getFullYear(), thisMonth.getMonth(), currentDay));
        }

        // Pad last week
        let lastWeekdayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), weeks[currentWeek][weeks[currentWeek].length - 1].day).getUTCDay();
        let nextMonth = (thisMonth.getMonth() + 1 % 12);
        let nextYear = (nextMonth == 0) ? thisMonth.getFullYear() + 1 : thisMonth.getFullYear();
        for (var currentDayOfMonth = 1; lastWeekdayOfMonth + 1 < 7; lastWeekdayOfMonth++) {
            weeks[currentWeek].push(new DateRepresentation(nextYear, nextMonth, currentDayOfMonth++));
        }

        // Make sure we have 6 weeks
        if (weeks.length < 6) {
            weeks.push([]);
            for (let lastDayOfWeek = currentDayOfMonth + 7; currentDayOfMonth < lastDayOfWeek; currentDayOfMonth++) {
                weeks[5].push(new DateRepresentation(nextYear, nextMonth, currentDayOfMonth));
            }
        }



        // TODO doesnt work for december and january


        return (
            <div>
            </div>
        )
    }
}

class DateRepresentation {
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
}

// get current month
// afgør hvor mange dage første uge skal have
// træk fra antal dage i måneden

class Week extends React.Component {

}

function Day(props) {
    return (
        <div />
    )
}



/*
 class Week extends React.component {

 }

 class Month extends React.component {
 constructor(props) {
 super(props);
 this.state = {}
 }

 render() {
 return (
 <div className="Month">
 Jeg er en måned
 </div>
 )
 }
 }

 class Day extends React.Component {
 render() {
 return (
 <div className="Day">
 Jeg er en dag
 </div>
 )
 }
 }
 */

export default App;
