import {connect} from 'react-redux';
import CalendarAndUsage from '../components/CalendarAndUsage/CalendarAndUsage';
import {endBookingFlow} from '../state/actions/bookingFlow';
import {createBooking, fetchBookings} from '../state/actions/bookings';
import {endEditBookingFlow} from '../state/actions/editBookingFlow';

const mapStateToProps = (state, ownProps) => {
    return {
        selectedMonth: (ownProps.params.year && ownProps.params.month) ? new Date(ownProps.params.year, ownProps.params.month) : new Date(),
        currentMonth: new Date(),
        showBookingModal: state.bookingFlow.showBookingModal || state.editBookingFlow.showBookingModal,
        bookingDate: state.bookingFlow.date || state.editBookingFlow.date,
        bookings: state.bookings.bookings,
        isLoggedIn: !!state.login.username,
        isEditMode: !!state.editBookingFlow.date,
        editBookingInformation: {
            id: state.editBookingFlow.id,
            startTime: state.editBookingFlow.startTime,
            endTime: state.editBookingFlow.endTime,
            numberOfTumbleDryUses: state.editBookingFlow.numberOfTumbleDryUses,
            numberOfWashingMachineUses: state.editBookingFlow.numberOfWashingMachineUses
        }
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
        },
        onCancelEditBookingCreation: () => {
            dispatch(endEditBookingFlow());
        }
    }
};

const CalendarAndUsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarAndUsage);

export default CalendarAndUsageContainer;