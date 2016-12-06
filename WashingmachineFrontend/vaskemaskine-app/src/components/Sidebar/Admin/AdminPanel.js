import React from 'react';
import './AdminPanel.css';
import fetch from 'isomorphic-fetch';
import urls from '../../../commons/urls';
import {monthNamesShort, YEAR_PROJECT_ENTERED_PROD, COST_OF_TUMBLE_DRY_USE, COST_OF_WASHING_MACHINE_USE} from '../../../commons/util';
import {Button} from 'react-bootstrap'
import download from 'downloadjs'



class AdminPanel extends React.Component {
    constructor(props) {
        super(props);

        let today = new Date();

        this.state = {
            // TODO default value should be different
            selectedStartDate: today,
            selectedEndDate: today
        };

        this.startDateChange = this.startDateChange.bind(this);
        this.endDateChange = this.endDateChange.bind(this);
        this.convertOptionValueToDate = this.convertOptionValueToDate.bind(this);
        this.downloadUsageForSelectedPeriod = this.downloadUsageForSelectedPeriod.bind(this);
    }

    downloadUsageForSelectedPeriod() {
        let startDateToFetchFor = new Date(this.state.selectedStartDate.getFullYear(), this.state.selectedStartDate.getMonth(), 1);
        let endDateToFetchFor = new Date(this.state.selectedEndDate.getFullYear(), this.state.selectedEndDate.getMonth() + 1, 0);

        fetch(`${urls.api.usage}/admin?startTime=${startDateToFetchFor.getTime()}&endTime=${endDateToFetchFor.getTime()}`, {
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            // TODO should make a CSVGenerator
            let csvFile = 'lejlighed;navn;år;måned;antal_vaskemaskine_brugt;antal_tørretumbler_brugt;pris_vaskemaskine;pris_tørretumbler\n';

            for (let usage of data) {
                csvFile += `${usage.apartment};${usage.realName};${usage.year};${usage.month};${usage.sumOfWashingMachineUses};${usage.sumOfTumbleDryUses};${COST_OF_WASHING_MACHINE_USE * usage.sumOfWashingMachineUses};${COST_OF_TUMBLE_DRY_USE * usage.sumOfTumbleDryUses}\n`;
            }

            download(csvFile, 'forbrug.csv', 'text/csv');
        });
    }

    startDateChange(event) {
        this.setState({
            selectedStartDate: this.convertOptionValueToDate(event.target.value)
        });
    }

    endDateChange(event) {
        this.setState({
            selectedEndDate: this.convertOptionValueToDate(event.target.value)
        });
    }

    convertOptionValueToDate(optionValue) {
        let year, month;
        [year, month] = (optionValue).split('-');
        return new Date(year, monthNamesShort.indexOf(month));
    }

    render() {
        return (
            <div className="admin-panel">
                <h3>Kasserpanel</h3>
                <p>Hent forbrug for alle lejligheder</p>
                <div>
                    <span>Periode:</span>
                </div>
                <MonthYearPicker
                    onChange={this.startDateChange}
                />
                {' '}til{' '}
                <MonthYearPicker
                    onChange={this.endDateChange}
                    earliestDateToShow={this.state.selectedStartDate} />
                <div className="download-button">
                    <Button onClick={this.downloadUsageForSelectedPeriod}>Download</Button>
                </div>
            </div>
        )
    }
}

const MonthYearPicker = (props) => {
    let today = new Date();
    let startYear = (props.earliestDateToShow) ? props.earliestDateToShow.getFullYear() : YEAR_PROJECT_ENTERED_PROD;
    let startMonth = (props.earliestDateToShow) ? props.earliestDateToShow.getMonth() : 0;
    let endYear = today.getFullYear();
    let endMonth = today.getMonth();

    let options = [];
    for (let year = startYear; year <= endYear; year++) {
        for (let month of monthNamesShort) {
            // Don't add months after current date
            if (year >= endYear && monthNamesShort.indexOf(month) > endMonth) {
                break;
            }
            // Don't add days before earliestDateToShow
            if (year <= startYear && monthNamesShort.indexOf(month) < startMonth) {
                continue;
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

    return (
        <select onChange={props.onChange}>
            {optionsAsNodes}
        </select>
    )
};

export default AdminPanel;