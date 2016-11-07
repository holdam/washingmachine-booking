package resources;

import api.Success;
import com.sun.org.apache.xerces.internal.impl.dv.util.HexBin;
import core.RoleHelper;
import core.User;
import core.Util;
import db.UserDAO;
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

    public UserResource(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @POST
    @Path("/create_user")
    public User createUser(@FormParam("username") @NotNull String username, @FormParam("password") String password) throws AuthenticationException {
        // TODO avoid spam and probably better password creation

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

    // TODO update password and that kind of shit
}
