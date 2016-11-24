import React from 'react';
import './Usage.css';
import {COST_OF_TUMBLE_DRY_USE, COST_OF_WASHING_MACHINE_USE} from '../../../commons/util';

class Usage extends React.Component {
    constructor(props) {
        super(props);

        // TODO maybe backend should return per month basis
        // Feed initial usage data
        let startDateToFetchFor = new Date(this.props.selectedMonthAsDate.getFullYear(), this.props.selectedMonthAsDate.getMonth() - 2, 1);
        let endDateToFetchFor = new Date(this.props.selectedMonthAsDate.getFullYear(), this.props.selectedMonthAsDate.getMonth() + 1, 0, 23, 59);
        this.props.fetchUsage(startDateToFetchFor, endDateToFetchFor);
    }

    render() {
        let lastThreeMonthsWashingMachinePrice = this.props.sumOfWashingMachineUses * COST_OF_WASHING_MACHINE_USE;
        let lastThreeMonthsTumbleDryPrice = this.props.sumOfTumbleDryUses * COST_OF_TUMBLE_DRY_USE;

        let lastThreeMonthsWashingMachinePercentage, lastThreeMonthsTumbleDryPercentage;
        if (lastThreeMonthsTumbleDryPrice === 0 && lastThreeMonthsWashingMachinePrice === 0) {
            lastThreeMonthsWashingMachinePercentage = 0.5;
            lastThreeMonthsTumbleDryPercentage = 0.5;
        } else if(lastThreeMonthsTumbleDryPrice === 0) {
            lastThreeMonthsWashingMachinePercentage = 1;
        } else if(lastThreeMonthsWashingMachinePrice === 0) {
            lastThreeMonthsTumbleDryPercentage = 1;
        } else {
            lastThreeMonthsWashingMachinePercentage = lastThreeMonthsWashingMachinePrice / lastThreeMonthsTumbleDryPrice;
            lastThreeMonthsTumbleDryPercentage = (1 - lastThreeMonthsWashingMachinePercentage) * 100 + '%';
        }

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
                    <span style={{width: lastThreeMonthsWashingMachinePercentage}} className="washing-machine-used">{4 * this.props.sumOfWashingMachineUses}</span>
                    <span style={{width: lastThreeMonthsTumbleDryPercentage}} className="tumble-dry-used">{3 * this.props.sumOfTumbleDryUses}</span>
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