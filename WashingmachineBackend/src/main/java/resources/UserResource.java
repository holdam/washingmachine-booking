package resources;

import api.Success;
import com.sun.org.apache.xerces.internal.impl.dv.util.HexBin;
import core.RoleHelper;
import core.User;
import core.Util;
import db.UserDAO;
import db.UserTokenDAO;
import exceptions.ValidationErrorException;
import org.apache.commons.lang3.RandomStringUtils;

import javax.naming.AuthenticationException;
import javax.validation.ValidationException;
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
    private UserTokenDAO userTokenDAO;

    public UserResource(UserDAO userDAO, UserTokenDAO userTokenDAO) {
        this.userDAO = userDAO;
        this.userTokenDAO = userTokenDAO;
    }

    @POST
    @Path("/create_user")
    public User createUser(@FormParam("username") @NotNull String username, @FormParam("password") @NotNull String password) throws AuthenticationException {
        // TODO avoid spam and probably better password creation (more restrict than just nonempty passwords)

        // Validations
        if (username.isEmpty() || password.isEmpty()) {
            throw new AuthenticationException();
        }

        String salt = RandomStringUtils.randomAlphanumeric(50);
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(password, salt);

        userDAO.insertUser(username, hashedAndSaltedPassword, salt, RoleHelper.ROLE_DEFAULT);
        return new User(username, RoleHelper.ROLE_DEFAULT);
    }

    @GET
    @Path("/username_exists")
    public Success doesUsernameExistAlready(@QueryParam("username") String username) {
        User user = userDAO.getUser(username);
        if (user == null) {
            return new Success("", true);
        }

        return new Success("Username already exist", false);
    }

    // TODO testing
    @GET
    @Path("/user_from_user_access_token")
    public User userFromUserAccessToken(@QueryParam("userAccessToken") String userAccessToken) {
        String username = userTokenDAO.getUsernameFromToken(userAccessToken);
        return userDAO.getUser(username);
    }

    // TODO update password and that kind of shit
}
