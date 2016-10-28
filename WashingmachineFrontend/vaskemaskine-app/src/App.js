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
// TODO når der klikkes på dag skal der åbnes mulighed for booking
// TODO hent bookings evt. fake med json array til at starte med
// TODO evt. farv lørdag/søndag i en anden farve
// TODO vis forbrug evt. for forskellige længder af perioder?


export default App;