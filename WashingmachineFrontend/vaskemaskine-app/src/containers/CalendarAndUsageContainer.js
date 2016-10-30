import {changePeriod} from '../state/actions/periodChooser';
import {connect} from 'react-redux';
import CalendarAndUsage from '../components/CalendarAndUsage/CalendarAndUsage';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedMonth: new Date(ownProps.params.year, ownProps.params.month),
        currentMonth: new Date()
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDayClick: (date) => {
            dispatch(changePeriod(date.year, date.month));
        },
        onMonthChangedClick: (date) => {
            dispatch(changePeriod(date.year, date.month));
        }
    }
};

const CalendarAndUsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarAndUsage);

export default CalendarAndUsageContainer;