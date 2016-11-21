package resources;

import api.UserTokenDTO;
import core.User;
import core.Util;
import db.UserDAO;
import db.UserTokenDAO;

import javax.naming.AuthenticationException;
import javax.validation.constraints.NotNull;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.util.Calendar;
import java.util.UUID;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {
    private UserTokenDAO userTokenDAO;
    private UserDAO userDAO;
    private int tokenLifetime;

    public AuthResource(UserTokenDAO userTokenDAO, UserDAO userDAO, int tokenLifetime) {
        this.userTokenDAO = userTokenDAO;
        this.userDAO = userDAO;
        this.tokenLifetime = tokenLifetime;
    }

    @POST
    @Path("/signin")
    public Response signIn(@FormParam("username") @NotNull String username, @NotNull @FormParam("password") String password) throws AuthenticationException {
        User user = userDAO.getUser(username);

        if (user == null) {
            throw new AuthenticationException("User does not exist");
        }
        // TODO http only cookies

        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(password, userDAO.getSaltForUser(username));
        if (userDAO.authenticateUser(username, hashedAndSaltedPassword) > 0) {
            // If token doesn't exist yet, we create one.
            UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromUsername(username);
            if (userTokenDTO == null) {
                userTokenDTO = createTokenForUser(username);
                return createResponseFromToken(userTokenDTO);
            }

            // Create new token for user if old one has about one day left on it
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            if (calendar.getTime().after(userTokenDTO.getLifetimeEnds())) {
                userTokenDAO.deleteUserTokenFromUsername(username);
                userTokenDTO = createTokenForUser(username);
                return createResponseFromToken(userTokenDTO);
            } else {
                // We return the current token
                return createResponseFromToken(userTokenDTO);
            }
        }

        throw new AuthenticationException("User not authenticated");
    }

    private Response createResponseFromToken(UserTokenDTO userTokenDTO) {
        long timeLeftToken = (userTokenDTO.getLifetimeEnds().getTime() - Calendar.getInstance().getTime().getTime()) / 1000;
        // TODO safe token
        return Response.ok()
                .cookie(
                        new NewCookie(
                                "userAccessToken", userTokenDTO.getToken(), "/", "test.myexample.com:3000",
                                "what", Math.toIntExact(timeLeftToken), false)
                ).build();
    }


    private UserTokenDTO createTokenForUser(String username) {
        // TODO may want to use more secure randomized string

        String uuid = UUID.randomUUID().toString();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, tokenLifetime);
        UserTokenDTO userTokenDTOToInsert = new UserTokenDTO(username, uuid, calendar.getTime(), UserTokenDTO.Status.VALID);
        userTokenDAO.createUserToken(userTokenDTOToInsert);
        return userTokenDTOToInsert;
    }
}
