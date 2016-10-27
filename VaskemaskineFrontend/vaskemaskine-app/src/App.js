import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarMaster from './Calendar/Calendar'
import Usage from './Usage/Usage'
import {monthNames} from './Commons/util';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Nordre Ringgade 108 vaskerumbooking</h2>
                </div>
                <div className="row">
                    <MonthPicker />
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <Usage />
                    </div>
                    <div className="col-md-6">
                        <CalendarMaster />
                    </div>
                    <div className="col-md-3">
                    </div>
                </div>
            </div>
        );
    }
}

class MonthPicker extends React.Component {
    render() {
        return (
            <div className="month-picker">
                <span>TILBAGE</span>
                <span>{monthNames[this.props.month]}</span>
                <span>FREMAD</span>
            </div>
        )
    }
}






export default App;