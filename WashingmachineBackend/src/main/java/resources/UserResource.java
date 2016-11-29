package resources;

import api.SuccessDTO;
import core.RoleHelper;
import core.User;
import core.Util;
import db.UserDAO;
import db.UserTokenDAO;
import org.apache.commons.lang3.RandomStringUtils;

import javax.naming.AuthenticationException;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;

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
    public SuccessDTO doesUsernameExistAlready(@QueryParam("username") String username) {
        User user = userDAO.getUser(username);
        if (user == null) {
            return new SuccessDTO("", true);
        }

        return new SuccessDTO("Username already exist", false);
    }

    @GET
    @Path("/user_from_user_access_token")
    public User userFromUserAccessToken(@CookieParam("userAccessToken") Cookie userAccessToken) {
        String username = userTokenDAO.getUsernameFromToken(userAccessToken.getValue());
        return userDAO.getUser(username);
    }
}
