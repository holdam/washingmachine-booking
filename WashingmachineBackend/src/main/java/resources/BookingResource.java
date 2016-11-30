package resources;

import api.BookingDTO;
import core.BookingService;
import core.User;
import core.Util;
import db.BookingDAO;
import db.UserTokenDAO;
import exceptions.ValidationErrorException;
import io.dropwizard.auth.Auth;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Path("/booking")
@Produces(MediaType.APPLICATION_JSON)
public class BookingResource {
    private BookingDAO bookingDAO;
    private UserTokenDAO userTokenDAO;
    private BookingService bookingService;

    public BookingResource(BookingDAO bookingDAO, UserTokenDAO userTokenDAO, BookingService bookingService) {
        this.bookingDAO = bookingDAO;
        this.userTokenDAO = userTokenDAO;
        this.bookingService = bookingService;
    }

    @POST
    public BookingDTO createBooking(@Auth User user,
                                    @FormParam("startTime") @NotNull @Min(0) Long startTime,
                                    @FormParam("endTime") @NotNull @Min(0) Long endTime,
                                    @FormParam("numberOfWashingMachineUses") @NotNull int numberOfWashingMachineUses,
                                    @FormParam("numberOfTumbleDryUses") @NotNull int numberOfTumbleDryUses) {
        if (!bookingService.validateCreateBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses)) {
            throw new ValidationErrorException("Input parameters were not valid for the chosen period");
        }
        Date startDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime);
        Date endDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime);

        // -1 for now, we will get correct id after insertion
        BookingDTO bookingDTOForInsertion = new BookingDTO(-1, startDate, endDate,
                user.getName(), numberOfTumbleDryUses, numberOfWashingMachineUses);
        bookingDAO.insertBooking(bookingDTOForInsertion);
        return bookingDAO.getBookingFromOwnerAndDates(user.getName(), startDate, endDate);
    }

    @PUT
    public BookingDTO editBooking(@Auth User user, @FormParam("id") int id,
                                  @FormParam("startTime") @NotNull @Min(0) Long startTime,
                                  @FormParam("endTime") @NotNull @Min(0) Long endTime,
                                  @FormParam("numberOfWashingMachineUses") @NotNull int numberOfWashingMachineUses,
                                  @FormParam("numberOfTumbleDryUses") @NotNull int numberOfTumbleDryUses) {
        if (!bookingService.validateEditBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses, id)) {
            throw new ValidationErrorException("Input parameters were not valid for the chosen period and id");
        }
        bookingDAO.updateBooking(user.getName(), id, Util.convertMillisToDateAndFloorToNearest5Minutes(startTime),
                Util.convertMillisToDateAndFloorToNearest5Minutes(endTime), numberOfWashingMachineUses, numberOfTumbleDryUses);
        return bookingDAO.getBookingFromId(user.getName(), id);
    }

    @GET
    @Path("/interval")
    public List<BookingDTO> getBookingsInInterval(@QueryParam("startTime") @NotNull @Min(0) Long startTime,
                                                  @QueryParam("endTime") @NotNull @Min(0) Long endTime,
                                                  @CookieParam("userAccessToken") Cookie userAccessToken) {

        String username = (userAccessToken != null) ? userTokenDAO.getUsernameFromToken(userAccessToken.getValue()) : "";
        return bookingDAO.getBookingsInInterval(Util.convertMillisToDateAndFloorToNearest5Minutes(startTime),
                Util.convertMillisToDateAndFloorToNearest5Minutes(endTime), username);
    }

    @DELETE
    public void deleteBooking(@Auth User user, @FormParam("id") @NotNull int id) {
        bookingDAO.deleteBooking(user.getName(), id);
    }
}
