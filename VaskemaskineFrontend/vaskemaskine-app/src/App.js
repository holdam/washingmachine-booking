import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarAndUsage from './CalendarAndUsage/CalendarAndUsage';

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

// TODO use router with months


export default App;