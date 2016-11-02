import {connect} from 'react-redux';
import CalendarAndUsage from '../components/CalendarAndUsage/CalendarAndUsage';
import {startBookingFlow, endBookingFlow} from '../state/actions/misc';
import {createBooking, fetchBookings} from '../state/actions/bookings';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedMonth: (ownProps.params.year && ownProps.params.month) ? new Date(ownProps.params.year, ownProps.params.month) : new Date(),
        currentMonth: new Date(),
        showBookingModal: state.misc.showBookingModal,
        bookingDate: state.misc.date,
        bookings: state.bookings
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDayClick: (date) => {
            dispatch(startBookingFlow(date))
        },
        onCreateBooking: (startTime, endTime, owner) => {
            dispatch(endBookingFlow());
            dispatch(createBooking(123123, startTime, endTime, owner))
        },
        onCancelBookingCreation: () => {
            dispatch(endBookingFlow());
        }
    }
};

const CalendarAndUsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarAndUsage);

export default CalendarAndUsageContainer;