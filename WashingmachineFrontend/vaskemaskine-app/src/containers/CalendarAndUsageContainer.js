import {connect} from 'react-redux';
import CalendarAndUsage from '../components/CalendarAndUsage/CalendarAndUsage';
import {endBookingFlow} from '../state/actions/bookingFlow';
import {insertBooking, fetchBookings} from '../state/actions/bookings';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedMonth: (ownProps.params.year && ownProps.params.month) ? new Date(ownProps.params.year, ownProps.params.month) : new Date(),
        currentMonth: new Date(),
        showBookingModal: state.bookingFlow.showBookingModal,
        bookingDate: state.bookingFlow.date,
        bookings: state.bookings.bookings
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCreateBooking: (startTime, endTime, owner) => {
            dispatch(endBookingFlow());
            dispatch(insertBooking(-1, startTime, endTime, owner))
        },
        onCancelBookingCreation: () => {
            dispatch(endBookingFlow());
        },
        fetchBookings: (startDate, endDate) => {
            dispatch(fetchBookings(startDate, endDate))
        }
    }
};

const CalendarAndUsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarAndUsage);

export default CalendarAndUsageContainer;