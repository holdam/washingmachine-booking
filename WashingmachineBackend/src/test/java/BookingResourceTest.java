import api.BookingDTO;
import core.RoleHelper;
import core.User;
import db.BookingDAO;
import exceptions.ValidationErrorException;
import org.junit.Assert;
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
    private final String USERNAME_1 = "user";

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
        calendar.set(Calendar.YEAR, 2000);
        Date startTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 15);
        Date endTime = calendar.getTime();
        bookingResource.createBooking(null, startTime.getTime(), endTime.getTime(), 1, 1);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToHaveStartTimeBeforeEndTime() {
        calendar.set(Calendar.HOUR_OF_DAY, 13);
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
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        Date startTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        Date endTime = calendar.getTime();
        when(bookingDAO.getBookingFromOwnerAndDates(USERNAME_1, startTime, endTime)).
                thenReturn(new BookingDTO(1337, startTime, endTime, USERNAME_1, 1, 0));
        BookingDTO bookingDTO = bookingResource.createBooking(new User(USERNAME_1, RoleHelper.ROLE_DEFAULT), startTime.getTime(), endTime.getTime(), 1, 0);
        assert(bookingDTO.getId() == 1337);
    }

    // Just need to test that even if overlapping exists, it's ok if it's only itself
    @Test
    public void editBookingShouldWork() {
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        Date startTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        Date endTime = calendar.getTime();

        calendar.add(Calendar.DAY_OF_YEAR, 10);
        Date endDateNotWithinBounds = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        Date startDateNotWithinBounds = calendar.getTime();

        ArrayList<BookingDTO> bookingsInInterval = new ArrayList<>();
        bookingsInInterval.add(new BookingDTO(1, startTime, endTime, USERNAME_1, 1, 1));
        bookingsInInterval.add(new BookingDTO(123, endDateNotWithinBounds, startDateNotWithinBounds, USERNAME_1, 1, 1));
        when(bookingDAO.getBookingsOverlappingInterval(startTime, endTime)).thenReturn(bookingsInInterval);
        when(bookingDAO.getBookingFromId(USERNAME_1, 1)).thenReturn(new BookingDTO(1, startTime, endTime, USERNAME_1, 1, 1));
        BookingDTO bookingDTO = bookingResource.editBooking(new User(USERNAME_1, RoleHelper.ROLE_DEFAULT), 1, startTime.getTime(), endTime.getTime(),
                123, 321);

        Assert.assertEquals(1, bookingDTO.getId());
        Assert.assertEquals(USERNAME_1, bookingDTO.getOwner());
        Assert.assertEquals(startTime, bookingDTO.getStartTime());
        Assert.assertEquals(endTime, bookingDTO.getEndTime());
    }

    @Test(expected = ValidationErrorException.class)
    public void overlappingBookingShouldResultInException() {
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        Date startTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        Date endTime = calendar.getTime();

        ArrayList<BookingDTO> bookingsInInterval = new ArrayList<>();
        bookingsInInterval.add(new BookingDTO(234, startTime, endTime, USERNAME_1, 1, 2));
        when(bookingDAO.getBookingsOverlappingInterval(startTime, endTime)).thenReturn(bookingsInInterval);
        bookingResource.editBooking(new User(USERNAME_1, RoleHelper.ROLE_DEFAULT), 1, startTime.getTime(), endTime.getTime(),
                123, 321);
    }
}
