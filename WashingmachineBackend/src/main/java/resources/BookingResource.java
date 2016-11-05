package resources;

import api.BookingDTO;
import core.User;
import core.Util;
import db.BookingDAO;
import exceptions.ValidationErrorException;
import io.dropwizard.auth.Auth;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Path("/booking")
@Produces(MediaType.APPLICATION_JSON)
public class BookingResource {
    private BookingDAO bookingDAO;

    public BookingResource(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @POST
    public BookingDTO createBooking(@Auth User user, @FormParam("startTime") @NotNull @Min(0) Long startTime,
                            @FormParam("endTime") @NotNull @Min(0) Long endTime) {
        validateBooking(startTime, endTime);
        BookingDTO bookingDTO = new BookingDTO(Util.convertMillisToDate(startTime), Util.convertMillisToDate(endTime), user.getName());
        bookingDAO.insertBooking(bookingDTO);
        return bookingDTO;
    }

    @GET
    @Path("/interval")
    public List<BookingDTO> getBookingsInInterval(@QueryParam("startTime") @NotNull @Min(0) Long startTime,
                                                  @QueryParam("endTime") @NotNull @Min(0) Long endTime) {
        return bookingDAO.getBookingsInInterval(Util.convertMillisToDate(startTime), Util.convertMillisToDate(endTime));
    }

    @DELETE
    public void deleteBooking(@Auth User user, @FormParam("startTime") @NotNull @Min(0) Long startTime,
                            @FormParam("endTime") @NotNull @Min(0) Long endTime) {
        bookingDAO.deleteBooking(user.getName(), Util.convertMillisToDate(startTime), Util.convertMillisToDate(endTime));
    }

    @PUT
    public void editBooking(@Auth User user, @FormParam("startTimeOld") @NotNull @Min(0) Long startTimeOld,
                            @FormParam("endTimeOld") @NotNull @Min(0) Long endTimeOld,
                            @FormParam("startTimeNew") @NotNull @Min(0) Long startTimeNew,
                            @FormParam("endTimeNew") @NotNull @Min(0) Long endTimeNew) {
        validateBooking(startTimeNew, endTimeNew);
        bookingDAO.updateBooking(user.getName(), Util.convertMillisToDate(startTimeOld), Util.convertMillisToDate(endTimeOld),
                Util.convertMillisToDate(startTimeNew), Util.convertMillisToDate(endTimeNew));
    }

    private void validateBooking(long startTime, long endTime) throws ValidationErrorException {
        Date startDate = Util.convertMillisToDate(startTime);
        Date endDate = Util.convertMillisToDate(endTime);
        Calendar startDateCalendar = Calendar.getInstance();
        Calendar endDateCalendar = Calendar.getInstance();
        startDateCalendar.setTimeInMillis(startTime);
        endDateCalendar.setTimeInMillis(endTime);

        // TODO same as front end bookings

        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);
        if (startDate.after(endDate) ||
                (endDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 || endDateCalendar.get(Calendar.HOUR_OF_DAY) > 22) ||
                (startDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 || endDateCalendar.get(Calendar.HOUR_OF_DAY) > 22) ||
                overlappingBookingDTOs.size() > 0) {
            throw new ValidationErrorException();
        }
    }
}
