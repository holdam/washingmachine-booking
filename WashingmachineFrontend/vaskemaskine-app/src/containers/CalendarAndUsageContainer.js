import {connect} from 'react-redux';
import CalendarAndUsage from '../components/CalendarAndUsage/CalendarAndUsage';
import {endCreateBookingFlow} from '../state/actions/createBookingFlow';
import {createBooking, fetchBookingsForMonth, editBooking, deleteBooking} from '../state/actions/bookings';
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
        editBookingProps: {
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
            dispatch(endCreateBookingFlow());
        },
        fetchBookingsForMonth: (year, month) => {
            dispatch(fetchBookingsForMonth(year, month))
        },
        onCancelEditBookingCreation: () => {
            dispatch(endEditBookingFlow());
        },
        onEditBooking: (id, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses) => {
            dispatch(editBooking(id, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses));
        },
        onDeleteBooking: (id) => {
            dispatch(deleteBooking(id));
        }
    }
};

const CalendarAndUsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarAndUsage);

export default CalendarAndUsageContainer;