package resources;

import api.UsageAdminExportDTO;
import api.UsageDTO;
import api.UserDTO;
import core.RoleHelper;
import core.Util;
import db.BookingDAO;
import db.UserTokenDAO;
import io.dropwizard.auth.Auth;

import javax.validation.constraints.Min;
import javax.ws.rs.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("/usage")
@Produces(MediaType.APPLICATION_JSON)
public class UsageResource {
    private BookingDAO bookingDAO;
    private UserTokenDAO userTokenDAO;

    public UsageResource(BookingDAO bookingDAO, UserTokenDAO userTokenDAO) {
        this.bookingDAO = bookingDAO;
        this.userTokenDAO = userTokenDAO;
    }

    @GET
    public List<UsageDTO> getUsageInInterval(@CookieParam("userAccessToken") Cookie userAccessToken,
                                             @QueryParam("startTime") @Min(0) long startTime,
                                             @QueryParam("endTime") @Min(0) long endTime) {
        // Return empty list if user is not logged in to ensure JSON is formatted correctly
        if (userAccessToken == null) return new ArrayList<>();

        String username = userTokenDAO.getUsernameFromToken(userAccessToken.getValue());
        return bookingDAO.getUsageInInterval(username,
                Util.convertMillisToDateAndFloorToNearest5Minutes(startTime),
                Util.convertMillisToDateAndFloorToNearest5Minutes(endTime));
    }

    @Path("/admin")
    @GET
    public List<UsageAdminExportDTO> getUsageInIntervalAdmin(@Auth UserDTO user,
                                                             @QueryParam("startTime") @Min(0) long startTime,
                                                             @QueryParam("endTime") @Min(0) long endTime) {
        if (! RoleHelper.isAdmin(user.getRole())) throw new WebApplicationException(Response.Status.FORBIDDEN);

        return bookingDAO.getUsageInIntervalAdmin(
                Util.convertMillisToDateAndFloorToNearest5Minutes(startTime),
                Util.convertMillisToDateAndFloorToNearest5Minutes(endTime)
        );
    }
}
