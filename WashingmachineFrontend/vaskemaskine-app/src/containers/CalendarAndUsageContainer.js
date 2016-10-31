import {connect} from 'react-redux';
import CalendarAndUsage from '../components/CalendarAndUsage/CalendarAndUsage';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedMonth: (ownProps.params.year && ownProps.params.year) ? new Date(ownProps.params.year, ownProps.params.month) : new Date(),
        currentMonth: new Date()
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDayClick: (date) => {
            window.alert(date.day);
        }
    }
};

const CalendarAndUsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarAndUsage);

export default CalendarAndUsageContainer;