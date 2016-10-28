package resources;

import com.sun.org.apache.xerces.internal.impl.dv.util.HexBin;
import core.RoleHelper;
import core.Util;
import db.UserDAO;
import org.apache.commons.lang3.RandomStringUtils;

import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {
    private UserDAO userDAO;

    public UserResource(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @POST
    public Response createUser(@FormParam("username") @NotNull String username, @FormParam("password") String password) {
        String salt = RandomStringUtils.randomAlphanumeric(50);
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(password, salt);

        // Validations
        if (username.isEmpty() || password.isEmpty()) {
            throw new WebApplicationException(400);
        }

        try {
            userDAO.insertUser(username, hashedAndSaltedPassword, salt, RoleHelper.ROLE_DEFAULT);
        } catch (Exception e) {
            throw new WebApplicationException(400);
        }

        return Response.status(Response.Status.OK).build();
    }

    // TODO update password and that kind of shit
}
