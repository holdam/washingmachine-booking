package resources;

import api.SuccessDTO;
import api.UserDTO;
import core.RoleHelper;
import core.Util;
import db.UserDAO;
import db.UserTokenDAO;
import org.apache.commons.lang3.RandomStringUtils;

import javax.naming.AuthenticationException;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import java.util.*;

@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {
    private final List<String> allowedApartments = Collections.unmodifiableList(
            Arrays.asList("st.v.", "st.h.", "1.tv.", "1.th.", "2.", "3.tv.", "3.th.", "4.")
    );
    private UserDAO userDAO;
    private UserTokenDAO userTokenDAO;

    public UserResource(UserDAO userDAO, UserTokenDAO userTokenDAO) {
        this.userDAO = userDAO;
        this.userTokenDAO = userTokenDAO;
    }

    @POST
    @Path("/create_user")
    public UserDTO createUser(@FormParam("username") @NotNull String username,
                              @FormParam("password") @NotNull String password,
                              @FormParam("name") @NotNull String name,
                              @FormParam("apartment") @NotNull String apartment) throws AuthenticationException {
        // Validations
        if (username.isEmpty() || password.isEmpty() || name.isEmpty() || ! allowedApartments.contains(apartment)) {
            throw new AuthenticationException();
        }
        String salt = RandomStringUtils.randomAlphanumeric(50);
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(password, salt);
        userDAO.insertUser(username, hashedAndSaltedPassword, salt, name, apartment, RoleHelper.ROLE_DEFAULT);
        return new UserDTO(username, RoleHelper.ROLE_DEFAULT, name, apartment);
    }

    @GET
    @Path("/username_exists")
    public SuccessDTO doesUsernameExistAlready(@QueryParam("username") String username) {
        UserDTO userDTO = userDAO.getUser(username);
        if (userDTO == null) {
            return new SuccessDTO("", true);
        }

        return new SuccessDTO("Username already exist", false);
    }

    @GET
    @Path("/user_from_user_access_token")
    public UserDTO userFromUserAccessToken(@CookieParam("userAccessToken") Cookie userAccessToken) {
        String username = userTokenDAO.getUsernameFromToken(userAccessToken.getValue());
        return userDAO.getUser(username);
    }
}
