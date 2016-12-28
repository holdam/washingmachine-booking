package resources;

import api.UserTokenDTO;
import api.UserDTO;
import core.Util;
import db.UserDAO;
import db.UserTokenDAO;
import io.dropwizard.auth.Auth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.AuthenticationException;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Calendar;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {
    private UserTokenDAO userTokenDAO;
    private UserDAO userDAO;
    private int tokenLifetime;
    private String domain;
    private final String USER_ACCESS_TOKEN = "userAccessToken";
    private Logger log = LoggerFactory.getLogger(AuthResource.class);

    public AuthResource(UserTokenDAO userTokenDAO, UserDAO userDAO, int tokenLifetime, String domain) {
        this.userTokenDAO = userTokenDAO;
        this.userDAO = userDAO;
        this.tokenLifetime = tokenLifetime;
        this.domain = domain;
    }

    @POST
    @Path("/sign_in")
    public Response signIn(@FormParam("username") @NotNull String username,
                           @NotNull @FormParam("password") String password) throws AuthenticationException {
        UserDTO userDTO = userDAO.getUser(username);

        if (userDTO == null) {
            throw new AuthenticationException("User does not exist");
        }

        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(password, userDAO.getSaltForUser(username));
        if (userDAO.authenticateUser(username, hashedAndSaltedPassword)) {
            log.info(username + " has been authenticated.");

            // If token doesn't exist yet, we create one.
            UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromUsername(username);
            if (userTokenDTO == null) {
                userTokenDTO = createTokenForUser(username);
                log.info("Creating new token: " + userTokenDTO.getToken() + ", for: " + username);
                return createResponseFromToken(userTokenDTO);
            }

            // Create new token for userDTO if old one has about one day left on it
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            if (calendar.getTime().after(userTokenDTO.getLifetimeEnds())) {
                userTokenDAO.deleteUserTokenFromUsername(username);
                userTokenDTO = createTokenForUser(username);
                log.info("Old token about to run out, creating new token: " + userTokenDTO.getToken() + ", for: " + username);
                return createResponseFromToken(userTokenDTO);
            } else {
                // We return the current token
                log.info("Returning old token: " + userTokenDTO.getToken() + ", for: " + username);
                return createResponseFromToken(userTokenDTO);
            }
        }

        throw new AuthenticationException("UserDTO not authenticated");
    }

    @POST
    @Path("/sign_out")
    public Response signOut(@CookieParam(USER_ACCESS_TOKEN) Cookie userAccessToken) {
        return Response.ok()
                .header("Set-Cookie", USER_ACCESS_TOKEN + "=deleted;Domain=" + domain + ";Path=/;Expires=Thu, 01-Jan-1970 00:00:01 GMT")
                .build();
    }

    private Response createResponseFromToken(UserTokenDTO userTokenDTO) {
        long timeLeftToken = (userTokenDTO.getLifetimeEnds().getTime() - Calendar.getInstance().getTime().getTime()) / 1000;
        return Response.ok()
                .cookie(
                        new NewCookie(
                                USER_ACCESS_TOKEN, userTokenDTO.getToken(), "/", domain,
                                "", Math.toIntExact(timeLeftToken), false))
                .entity(userTokenDTO)
                .build();
    }


    private UserTokenDTO createTokenForUser(String username) {
        // Generate 128-bit random token
        byte[] bytes = new byte[17];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(bytes);
        bytes[0] = 0;
        String token = new BigInteger(bytes).toString();

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, tokenLifetime);
        UserTokenDTO userTokenDTOToInsert = new UserTokenDTO(username, token, calendar.getTime(), UserTokenDTO.Status.VALID);
        userTokenDAO.createUserToken(userTokenDTOToInsert);
        return userTokenDTOToInsert;
    }
}
