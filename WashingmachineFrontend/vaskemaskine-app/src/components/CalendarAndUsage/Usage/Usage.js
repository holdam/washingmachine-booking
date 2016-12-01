import React from 'react';
import './Usage.css';
import {COST_OF_TUMBLE_DRY_USE, COST_OF_WASHING_MACHINE_USE, monthNamesShort} from '../../../commons/util';
import strings from '../../../commons/strings';

class Usage extends React.Component {
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
            ratioAB = 1;
            ratioBA = 0;
        } else if (b === 0) {
            ratioBA = 1;
            ratioAB = 0;
        } else {
            ratioAB = a / (a + b);
            ratioBA = (1 - ratioAB);
        }
        return [ratioAB, ratioBA];
    }

    convertRatiosToPercentageForCSS(a, b) {
        return [
            (a * 100) + '%',
            (b * 100) + '%'
        ]

    }

    render() {
        // Allows us to use shorter more readable syntax
        let usage = this.props.usage;
        let lastThreeMonthsWashingMachinePrice = 0, lastThreeMonthsTumbleDryPrice = 0,
            thisMonthsWashingMachinePrice = 0, thisMonthsTumbleDryPrice = 0;

        // Calculate last 3 months and last months of usage
        for (let i = 0; i < usage.length; i++) {
            lastThreeMonthsWashingMachinePrice += (usage[i].sumOfWashingMachineUses * COST_OF_WASHING_MACHINE_USE);
            lastThreeMonthsTumbleDryPrice += (usage[i].sumOfTumbleDryUses * COST_OF_TUMBLE_DRY_USE);

            if (this.state.today.getMonth() === usage[i].month) {
                thisMonthsWashingMachinePrice = usage[i].sumOfWashingMachineUses * COST_OF_WASHING_MACHINE_USE;
                thisMonthsTumbleDryPrice = usage[i].sumOfTumbleDryUses * COST_OF_TUMBLE_DRY_USE;
            }
        }

        let lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage,
            thisMonthsWashingMachinePercentage, thisMonthsTumbleDryPercentage;


        [lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage] =
            this.convertRatiosToPercentageForCSS(
                ...this.getRatioInPercentageBetweenNumbers(lastThreeMonthsWashingMachinePrice, lastThreeMonthsTumbleDryPrice)
            );

        [thisMonthsWashingMachinePercentage, thisMonthsTumbleDryPercentage] =
            this.convertRatiosToPercentageForCSS(
                ...this.getRatioInPercentageBetweenNumbers(thisMonthsWashingMachinePrice, thisMonthsTumbleDryPrice)
            );


        let lastThreeMonthsText = `${strings.usage.lastThreeMonths} (${monthNamesShort[this.state.startMonth]}-${monthNamesShort[this.state.endMonth]})`;

        return (
            <div className="usage">
                <h3>Forbrug</h3>
                <UsageBar
                    widthMachineUsage={thisMonthsWashingMachinePercentage}
                    widthTumbleDryUsage={thisMonthsTumbleDryPercentage}
                    washingMachineUsage={thisMonthsWashingMachinePrice}
                    tumbleDryUsage={thisMonthsTumbleDryPrice}
                    headerText={strings.usage.thisMonth}
                />
                <UsageBar
                    widthMachineUsage={lastThreeMonthsWashingMachinePercentage}
                    widthTumbleDryUsage={lastThreeMonthsTumbleDryPercentage}
                    washingMachineUsage={lastThreeMonthsWashingMachinePrice}
                    tumbleDryUsage={lastThreeMonthsTumbleDryPrice}
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
                <div style={{width: props.widthMachineUsage}} className="washing-machine-used">
                    {props.washingMachineUsage} kr
                </div>
                <div style={{width: props.widthTumbleDryUsage}} className="tumble-dry-used">
                    {props.tumbleDryUsage} kr
                </div>
            </div>
        </div>
    )
};




export default Usage;