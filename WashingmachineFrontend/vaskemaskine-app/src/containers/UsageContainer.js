import Usage from "../components/CalendarAndUsage/Usage/Usage";
import {connect} from 'react-redux';
import {fetchUsage} from '../state/actions/usage';

const mapStateToProps = (state) => {
    return {
        sumOfWashingMachineUses: state.usage.sumOfWashingMachineUses,
        sumOfTumbleDryUses: state.usage.sumOfTumbleDryUses,
        selectedMonthAsDate: state.calendar.selectedMonthAsDate
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsage: (startDateToFetchFor, endDateToFetchFor) => {
            dispatch(fetchUsage(startDateToFetchFor, endDateToFetchFor));
        }
    }
};

const UsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Usage);

export default UsageContainer;