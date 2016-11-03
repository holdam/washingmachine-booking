import {connect} from 'react-redux';
import {Day} from '../components/CalendarAndUsage/Calendar/Calendar';
import {startBookingFlow} from '../state/actions/bookingFlow';

const mapStateToProps = (state) => {
    return {
        bookings: state.bookings.bookings
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (date) => {
            dispatch(startBookingFlow(date))
        }
    }
};

const DayContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Day);

export default DayContainer;