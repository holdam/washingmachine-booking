import React from 'react';
import './UsagePanel.css';
import {COST_OF_TUMBLE_DRY_USE, COST_OF_WASHING_MACHINE_USE, monthNamesShort} from '../../../commons/util';
import strings from '../../../commons/strings';

class UsagePanel extends React.Component {
    constructor(props) {
        super(props);

        let today = new Date();
        let startDateToFetchFor = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        let endDateToFetchFor = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        this.state = {
            today,
            startMonth: startDateToFetchFor.getMonth(),
            endMonth: endDateToFetchFor.getMonth()
        };

        // Retrieve last 3 months of usage
        this.props.fetchUsage(startDateToFetchFor, endDateToFetchFor);
    }

    getRatioInPercentageBetweenNumbers(a, b) {
        let ratioAB, ratioBA;

        if (a === 0 && b === 0) {
            ratioAB = 0.5;
            ratioBA = 0.5;
        } else if (a === 0) {
            ratioAB = 0;
            ratioBA = 1;
        } else if (b === 0) {
            ratioAB = 1;
            ratioBA = 0;
        } else {
            ratioAB = a / (a + b);
            ratioBA = (1 - ratioAB);
        }
        return [ratioAB, ratioBA];
    }

    convertRatiosToPercentageForCSS(a, b) {
        // Default to at least 30%
        // TODO should do something smarter than this
        a = Math.max(a, 0.30);
        b = 1 - a;
        b = Math.max(b, 0.30);
        a = 1 - b;

        return [
            (a * 100) + '%',
            (b * 100) + '%'
        ]

    }

    render() {
        // Allows us to use shorter more readable syntax
        let usage = this.props.usage;
        let thisMonthsWashingMachineUsage = 0;
        let thisMonthsTumbleDryUsage = 0;
        let lastThreeMonthsTumbleDryUsage = 0;
        let lastThreeMonthsWashingMachineUsage = 0;

        // Calculate last 3 months and last months of usage
        for (let i = 0; i < usage.length; i++) {
            lastThreeMonthsWashingMachineUsage += usage[i].sumOfWashingMachineUses;
            lastThreeMonthsTumbleDryUsage += usage[i].sumOfTumbleDryUses;

            if (this.state.today.getMonth() === usage[i].month) {
                thisMonthsWashingMachineUsage = usage[i].sumOfWashingMachineUses;
                thisMonthsTumbleDryUsage = usage[i].sumOfTumbleDryUses;
            }
        }

        let thisMonthsWashingMachinePercentage, thisMonthsTumbleDryPercentage,
            lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage;


        [thisMonthsWashingMachinePercentage, thisMonthsTumbleDryPercentage] =
            this.convertRatiosToPercentageForCSS(
                ...this.getRatioInPercentageBetweenNumbers(
                    thisMonthsWashingMachineUsage * COST_OF_WASHING_MACHINE_USE,
                    thisMonthsTumbleDryUsage * COST_OF_TUMBLE_DRY_USE)
            );
        [lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage] =
            this.convertRatiosToPercentageForCSS(
                ...this.getRatioInPercentageBetweenNumbers(
                    lastThreeMonthsWashingMachineUsage * COST_OF_WASHING_MACHINE_USE,
                    lastThreeMonthsTumbleDryUsage * COST_OF_TUMBLE_DRY_USE)
            );


        let lastThreeMonthsText = `${strings.usage.lastThreeMonths}, ${monthNamesShort[this.state.startMonth]}-${monthNamesShort[this.state.endMonth]}`;

        return (
            <div>
                <h3>{strings.usage.usage}</h3>
                <UsageBar
                    widthMachineUsage={thisMonthsWashingMachinePercentage}
                    widthTumbleDryUsage={thisMonthsTumbleDryPercentage}
                    washingMachineUsage={thisMonthsWashingMachineUsage}
                    tumbleDryUsage={thisMonthsTumbleDryUsage}
                    headerText={strings.usage.thisMonth}
                />
                <UsageBar
                    widthMachineUsage={lastThreeMonthsWashingMachinePercentage}
                    widthTumbleDryUsage={lastThreeMonthsTumbleDryPercentage}
                    washingMachineUsage={lastThreeMonthsWashingMachineUsage}
                    tumbleDryUsage={lastThreeMonthsTumbleDryUsage}
                    headerText={lastThreeMonthsText}
                />
                <div className="icon">
                    <div className="icon-washing-machine"></div>
                    <span className="icon-explanation">Vaskemaskine</span>
                </div>
                <div className="icon">
                    <div className="icon-tumble-dries"></div>
                    <span className="icon-explanation">Tørretumbler</span>
                </div>
            </div>
        )
    }
}

const UsageBar = (props) => {
    return (
        <div>
            <p>{props.headerText}</p>
            <div className="usage-bar">
                <div style={{width: props.widthMachineUsage}} className="washing-machine-usage">
                    {props.washingMachineUsage} ({props.washingMachineUsage * COST_OF_WASHING_MACHINE_USE} {strings.misc.currencyShort})
                </div>
                <div style={{width: props.widthTumbleDryUsage}} className="tumble-dry-usage">
                    {props.tumbleDryUsage} ({props.tumbleDryUsage * COST_OF_TUMBLE_DRY_USE} {strings.misc.currencyShort})
                </div>
            </div>
        </div>
    )
};


export default UsagePanel;