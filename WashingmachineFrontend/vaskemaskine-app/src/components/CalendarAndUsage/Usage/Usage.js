import React from 'react';
import './Usage.css';
import {COST_OF_TUMBLE_DRY_USE, COST_OF_WASHING_MACHINE_USE} from '../../../commons/util';

class Usage extends React.Component {
    constructor(props) {
        super(props);

        // TODO maybe backend should return per month basis
        // Feed initial usage data
        let today = new Date();
        let startDateToFetchFor = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        let endDateToFetchFor = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59);
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

    render() {
        let lastThreeMonthsWashingMachinePrice = this.props.sumOfWashingMachineUses * COST_OF_WASHING_MACHINE_USE;
        let lastThreeMonthsTumbleDryPrice = this.props.sumOfTumbleDryUses * COST_OF_TUMBLE_DRY_USE;

        let lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage;
        [lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage] =
            this.getRatioInPercentageBetweenNumbers(lastThreeMonthsWashingMachinePrice, lastThreeMonthsTumbleDryPrice);


        console.log(lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage);

        lastThreeMonthsTumbleDryPercentage = (lastThreeMonthsTumbleDryPercentage * 100) + '%';
        lastThreeMonthsWashingMachinePercentage = (lastThreeMonthsWashingMachinePercentage * 100) + '%';


        // TODO

        return (
            <div className="usage">
                <h3>Forbrug</h3>
                <p>Denne måned</p>
                <div>
                    <span className="tumble-dry-used">34 kr</span>
                    <span>72 kr</span>
                </div>
                <p className="total-price">30 kroner</p>
                <p>Sidste 3 måneder (sep-nov)</p>
                <div className="last-three-months-usage">
                    <div style={{width: lastThreeMonthsWashingMachinePercentage}} className="washing-machine-used">
                        {COST_OF_WASHING_MACHINE_USE * this.props.sumOfWashingMachineUses} kr
                    </div>
                    <div style={{width: lastThreeMonthsTumbleDryPercentage}} className="tumble-dry-used">
                        {COST_OF_TUMBLE_DRY_USE * this.props.sumOfTumbleDryUses} kr
                    </div>
                </div>







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

export default Usage;