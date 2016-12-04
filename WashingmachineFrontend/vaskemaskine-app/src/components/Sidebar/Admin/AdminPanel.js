import React from 'react';
import './AdminPanel.css';
import fetch from 'isomorphic-fetch';
import urls from '../../../commons/urls';
import {monthNamesShort, YEAR_PROJECT_ENTERED_PROD} from '../../../commons/util';
import {Button} from 'react-bootstrap'



class AdminPanel extends React.Component {

    downloadUsageForPeriod(startTime, endTime) {
        fetch(`${urls.api.usage}/admin?startTime=${startTime}&endTime=${endTime}`, {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
        });
    }



    render() {
        return (
            <div className="admin-panel">
                <h3>Kasserpanel</h3>
                <p>Hent forbrug for alle lejligheder</p>
                <div>
                    <span>Periode:</span>
                </div>
                <MonthYearPicker />
                {' '}til{' '}
                <MonthYearPicker />
                <div>
                    <Button>Download</Button>
                </div>
            </div>
        )
    }
}

const MonthYearPicker = (props) => {
    // TODO vis kun gyldige perioder for anden boks?
    let today = new Date();
    let startYear = YEAR_PROJECT_ENTERED_PROD;
    let endYear = today.getFullYear();
    let endMonth = today.getMonth();

    let options = [];
    for (let year = startYear; year <= endYear; year++) {
        for (let month of monthNamesShort) {
            if (year >= endYear && monthNamesShort.indexOf(month) > endMonth) {
                break;
            }

            options.push({year, month})
        }
    }

    options.reverse();

    let optionsAsNodes = options.map((option) => {
        return (
            <option key={`${option.year}-${option.month}`}>
                {`${option.year}-${option.month}`}
            </option>
        )
    });


    console.log(options)



    return (
        <select>
            {optionsAsNodes}
        </select>
    )
};

export default AdminPanel;