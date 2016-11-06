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
    public BookingDTO createBooking(@Auth User user,
                                    @FormParam("startTime") @NotNull @Min(0) Long startTime,
                                    @FormParam("endTime") @NotNull @Min(0) Long endTime,
                                    @FormParam("numberOfWashingMachineUses") @NotNull int numberOfWashingMachineUses,
                                    @FormParam("numberOfTumbleDryUses") @NotNull int numberOfTumbleDryUses) {
        validateBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses);
        Date startDate = Util.convertMillisToDate(startTime);
        Date endDate = Util.convertMillisToDate(endTime);
        // -1 for now, we will get correct id after insertion
        BookingDTO bookingDTOForInsertion = new BookingDTO(-1, startDate, endDate,
                user.getName(), numberOfTumbleDryUses, numberOfWashingMachineUses);
        bookingDAO.insertBooking(bookingDTOForInsertion);
        return bookingDAO.getBookingFromOwnerAndDates(user.getName(), startDate, endDate);
    }

    @GET
    @Path("/interval")
    public List<BookingDTO> getBookingsInInterval(@QueryParam("startTime") @NotNull @Min(0) Long startTime,
                                                  @QueryParam("endTime") @NotNull @Min(0) Long endTime) {
        return bookingDAO.getBookingsInInterval(Util.convertMillisToDate(startTime), Util.convertMillisToDate(endTime));
    }

    @DELETE
    public void deleteBooking(@Auth User user, @FormParam("id") @NotNull int id) {
        bookingDAO.deleteBooking(user.getName(), id);
    }

    @PUT
    public void editBooking(@Auth User user, @FormParam("id") int id,
                            @FormParam("startTime") @NotNull @Min(0) Long startTime,
                            @FormParam("endTime") @NotNull @Min(0) Long endTime,
                            @FormParam("numberOfWashingMachineUses") @NotNull int numberOfWashingMachineUses,
                            @FormParam("numberOfTumbleDryUses") @NotNull int numberOfTumbleDryUses) {
        validateBooking(startTime, endTime,numberOfWashingMachineUses, numberOfTumbleDryUses);
        bookingDAO.updateBooking(user.getName(), id, Util.convertMillisToDate(startTime), Util.convertMillisToDate(endTime),
                numberOfWashingMachineUses, numberOfTumbleDryUses);
    }

    private void validateBooking(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses) throws ValidationErrorException {
        Date startDate = Util.convertMillisToDate(startTime);
        Date endDate = Util.convertMillisToDate(endTime);
        Calendar startDateCalendar = Calendar.getInstance();
        Calendar endDateCalendar = Calendar.getInstance();
        startDateCalendar.setTimeInMillis(startTime);
        endDateCalendar.setTimeInMillis(endTime);

        long timeDifference = endTime - startTime;
        boolean timeDifferenceGreaterThan30Minutes = (timeDifference / 1000 / 60) >= 30;

        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);
        if (startDate.after(endDate) ||
                (endDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 || (endDateCalendar.get(Calendar.HOUR_OF_DAY) >= 22 && endDateCalendar.get(Calendar.MINUTE) > 0)) ||
                (startDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 || (startDateCalendar.get(Calendar.HOUR_OF_DAY) >= 22 && startDateCalendar.get(Calendar.MINUTE) > 0)) ||
                overlappingBookingDTOs.size() > 0 ||
                startDate.before(new Date()) ||
                !timeDifferenceGreaterThan30Minutes ||
                (numberOfTumbleDryUses == 0 && numberOfWashingMachineUses == 0)) {
            throw new ValidationErrorException();
        }
    }
}
