import api.BookingDTO;
import core.User;
import db.BookingDAO;
import exceptions.ValidationErrorException;
import org.junit.Before;
import org.junit.Test;
import resources.BookingResource;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BookingResourceTest {
    private BookingDAO bookingDAO;
    private BookingResource bookingResource;
    private Calendar calendar;

    @Before
    public void setup() {
        bookingDAO = mock(BookingDAO.class);
        bookingResource = new BookingResource(bookingDAO);
        calendar = Calendar.getInstance();
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToStartBookingBefore8() {
        calendar.set(Calendar.HOUR_OF_DAY, 7);
        calendar.set(Calendar.MINUTE, 59);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime, 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToStartBookingAfter22() {
        calendar.set(Calendar.HOUR_OF_DAY, 22);
        calendar.set(Calendar.MINUTE, 1);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 9);
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime, 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToEndBookingAfter22() {
        calendar.set(Calendar.HOUR_OF_DAY, 8);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 22);
        calendar.set(Calendar.MINUTE, 1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime, 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToEndBookingAfter22ButBefore8() {
        calendar.set(Calendar.HOUR_OF_DAY, 8);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 6);
        calendar.set(Calendar.MINUTE, 0);
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime, 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToBookBackInTime() {
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        bookingResource.createBooking(null, new Date(0).getTime(), calendar.getTime().getTime(), 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToHaveStartTimeBeforeEndTime() {
        long startTime = calendar.getTime().getTime();
        calendar.add(Calendar.HOUR_OF_DAY, -1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime, 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToBookLessThanThirtyMinutes() {
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        long startTime = calendar.getTime().getTime();
        calendar.add(Calendar.MINUTE, 10);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime, 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToBookWithoutAnyWashesOrTumbleDries() {
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime, 0, 0);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToBookWithClashingBookings() {
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        Date startTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        Date endTime = calendar.getTime();
        List<BookingDTO> overlappingBookings = new ArrayList<>();
        overlappingBookings.add(new BookingDTO(0, null, null, null, 0, 0));
        when(bookingDAO.getBookingsOverlappingInterval(startTime, endTime)).thenReturn(overlappingBookings);
        bookingResource.createBooking(null, startTime.getTime(), endTime.getTime(), 1, 1);
    }

    // Covers all other methods as well, we test the DAO instead.
    @Test
    public void shouldBeAbleToCreateCorrectBooking() {
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        Date startTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        Date endTime = calendar.getTime();
        when(bookingDAO.getBookingFromOwnerAndDates("user", startTime, endTime)).
                thenReturn(new BookingDTO(1337, startTime, endTime, "user", 1, 0));
        BookingDTO bookingDTO = bookingResource.createBooking(new User("user", 0), startTime.getTime(), endTime.getTime(), 1, 0);
        assert(bookingDTO.getId() == 1337);
    }

}
