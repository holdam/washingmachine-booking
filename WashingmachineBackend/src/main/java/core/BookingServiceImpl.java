package core;

import api.BookingDTO;
import db.BookingDAO;
import exceptions.ValidationErrorException;
import interfaces.BookingObserver;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class BookingServiceImpl implements BookingService {
    private BookingDAO bookingDAO;
    public BookingServiceImpl(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }


    @Override
    public BookingDTO validateAndUpdateBooking(int id, Date startDate, Date endDate, int numberOfWashingMachineUses, int numberOfTumbleDryUses, String username) {
        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);
        if (overlappingBookingDTOs.size() > 0 && overlappingBookingDTOs.get(0).getId() != id ||
                ! commonValidationsForBooking(startDate, endDate, numberOfWashingMachineUses, numberOfTumbleDryUses)) {
            throw new ValidationErrorException("Input parameters were not valid for the chosen period");
        }

        bookingDAO.updateBooking(username, id, startDate, endDate, numberOfWashingMachineUses, numberOfTumbleDryUses);
        BookingDTO updatedBooking = bookingDAO.getBookingFromId(username, id);
        notifyBookingObserversBookingChanged(BookingDTO.createAnonymizedBooking(updatedBooking));
        return updatedBooking;
    }

    @Override
    public BookingDTO validateAndCreateBooking(Date startDate, Date endDate, int numberOfWashingMachineUses, int numberOfTumbleDryUses, String username) {
        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);

        if (overlappingBookingDTOs.size() > 0 || startDate.before(new Date()) ||
                ! commonValidationsForBooking(startDate, endDate, numberOfWashingMachineUses, numberOfTumbleDryUses)) {
            throw new ValidationErrorException("Input parameters were not valid for the chosen period");
        }

        BookingDTO bookingForInsertion = BookingDTO.createBookingWithoutId(startDate, endDate, username, numberOfTumbleDryUses, numberOfWashingMachineUses);
        bookingDAO.insertBooking(bookingForInsertion);
        BookingDTO insertedBooking = bookingDAO.getBookingFromOwnerAndDates(username, startDate, endDate);
        notifyBookingObserversBookingAdded(BookingDTO.createAnonymizedBooking(insertedBooking));
        return insertedBooking;
    }

    private boolean commonValidationsForBooking(Date startDate, Date endDate, int numberOfWashingMachineUses, int numberOfTumbleDryUses) throws ValidationErrorException {
        Calendar startDateCalendar = Calendar.getInstance();
        Calendar endDateCalendar = Calendar.getInstance();
        startDateCalendar.setTimeInMillis(startDate.getTime());
        endDateCalendar.setTimeInMillis(endDate.getTime());

        long timeDifference = endDate.getTime() - startDate.getTime();
        boolean timeDifferenceGreaterThan30Minutes = (timeDifference / 1000 / 60) >= 30;
        if (startDate.after(endDate) ||
                endDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 ||
                (endDateCalendar.get(Calendar.HOUR_OF_DAY) >= 22 && endDateCalendar.get(Calendar.MINUTE) > 0) ||
                startDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 ||
                startDateCalendar.get(Calendar.HOUR_OF_DAY) >= 22 ||
                ! timeDifferenceGreaterThan30Minutes ||
                (numberOfTumbleDryUses <= 0 && numberOfWashingMachineUses <= 0)) {
            return false;
        }

        return true;
    }
}
