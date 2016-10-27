import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarMaster from './Calendar/Calendar'


class App extends Component {
    render() {
        let today = new Date();
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <CalendarMaster/>
            </div>
        );
    }
}






export default App;