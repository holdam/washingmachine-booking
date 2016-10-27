import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from './Calendar/Calendar';
import Usage from './Usage/Usage';
import MonthPicker from './Monthpicker/Monthpicker';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Nordre Ringgade 108 vaskerumbooking</h2>
                </div>
                <CalendarAndUsage />
            </div>
        );
    }
}

class CalendarAndUsage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()}
    }

    render() {
        return (
            <div className="calendarAndUsage">
                <MonthPicker month={this.state.date.getMonth()} />
                <div className="row">
                    <Usage />
                    <div className="col-md-6">
                        <Calendar month={this.state.getMonth()} year={this.state.getFullYear()} />
                    </div>
                </div>
            </div>
        )
    }
}




export default App;