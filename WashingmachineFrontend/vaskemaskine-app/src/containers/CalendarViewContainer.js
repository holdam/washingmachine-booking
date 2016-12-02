import {connect} from 'react-redux';
import CalendarView from '../components/CalendarView/CalendarView';
import {endCreateBookingFlow} from '../state/actions/createBookingFlow';
import {createBooking, editBooking, deleteBooking} from '../state/actions/bookings';
import {changeMonth} from '../state/actions/calendar';
import {endEditBookingFlow} from '../state/actions/editBookingFlow';

const mapStateToProps = (state) => {
    return {
        selectedMonthAsDate: state.calendar.selectedMonthAsDate,
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
        changeMonth: (selectedMonthAsDate) => {
            dispatch(changeMonth(selectedMonthAsDate));
        },
        onCreateBooking: (startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses) => {
            dispatch(createBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses));
        },
        onCancelBookingCreation: () => {
            dispatch(endCreateBookingFlow());
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

const CalendarViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarView);

export default CalendarViewContainer;