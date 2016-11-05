package resources;

import api.UsageDTO;
import core.RoleHelper;
import core.User;
import core.Util;
import db.UsageDAO;
import io.dropwizard.auth.Auth;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Path("/usage")
@Produces(MediaType.APPLICATION_JSON)
public class UsageResource {
    private UsageDAO usageDAO;

    public UsageResource(UsageDAO usageDAO) {
        this.usageDAO = usageDAO;
    }

    @Path("/washing_machine")
    @POST
    public void incrementWashingMachineUsage(@Auth User user) {
        usageDAO.insertUsage(user.getName(), UsageDTO.WASHING_MACHINE, getStartDateOfCurrentMonth());
    }

    @Path("/washing_machine")
    @DELETE
    public void decrementWashingMachineUsage(@Auth User user) {
        usageDAO.deleteUsage(user.getName(), UsageDTO.WASHING_MACHINE, getStartDateOfCurrentMonth());
    }

    @Path("/tumble_drier")
    @POST
    public void incrementTumbleDrierUsage(@Auth User user) {
        usageDAO.insertUsage(user.getName(), UsageDTO.TUMBLE_DRIER, getStartDateOfCurrentMonth());
    }

    @Path("/tumble_drier")
    @DELETE
    public void decrementTumbleDrierUsage(@Auth User user) {
        usageDAO.deleteUsage(user.getName(), UsageDTO.TUMBLE_DRIER, getStartDateOfCurrentMonth());
    }

    @GET
    public List<UsageDTO> getUsagesForSelfInInterval(@Auth User user, @QueryParam("startTime") @NotNull @Min(0) Long startTime,
                                                     @QueryParam("endTime") @NotNull @Min(0) Long endTime) {
        return usageDAO.getUsageForUserInInterval(user.getName(), Util.convertMillisToDate(startTime), Util.convertMillisToDate(endTime));
    }

    @Path("/all")
    @GET
    public List<UsageDTO> getAllUsageForAllInInterval(@Auth User user, @QueryParam("startTime") @NotNull @Min(0) Long startTime,
                                                      @QueryParam("endTime") @NotNull @Min(0) Long endTime) {
        if (!RoleHelper.isAdmin(user.getRole())) {
            throw new WebApplicationException(403);
        }

        return usageDAO.getAllUsagesInInterval(Util.convertMillisToDate(startTime), Util.convertMillisToDate(endTime));
    }

    private Date getStartDateOfCurrentMonth() {
        Calendar startDateOfMonth = Calendar.getInstance();
        startDateOfMonth.set(Calendar.DAY_OF_MONTH, 1);
        startDateOfMonth.set(Calendar.HOUR_OF_DAY, 0);
        startDateOfMonth.set(Calendar.MINUTE, 0);
        startDateOfMonth.set(Calendar.SECOND, 0);
        startDateOfMonth.set(Calendar.MILLISECOND, 0);
        return startDateOfMonth.getTime();
    }
}
