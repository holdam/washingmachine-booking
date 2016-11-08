import {connect} from 'react-redux';
import CalendarAndUsage from '../components/CalendarAndUsage/CalendarAndUsage';
import {endBookingFlow} from '../state/actions/bookingFlow';
import {createBooking, fetchBookings} from '../state/actions/bookings';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedMonth: (ownProps.params.year && ownProps.params.month) ? new Date(ownProps.params.year, ownProps.params.month) : new Date(),
        currentMonth: new Date(),
        showBookingModal: state.bookingFlow.showBookingModal,
        bookingDate: state.bookingFlow.date,
        bookings: state.bookings.bookings,
        isLoggedIn : !!state.login.username
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCreateBooking: (startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses) => {
            dispatch(createBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses));
        },
        onCancelBookingCreation: () => {
            dispatch(endBookingFlow());
        },
        fetchBookings: (startTime, endTime) => {
            dispatch(fetchBookings(startTime, endTime))
        }
    }
};

const CalendarAndUsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarAndUsage);

export default CalendarAndUsageContainer;