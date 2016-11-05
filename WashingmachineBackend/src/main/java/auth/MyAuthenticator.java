package auth;

import api.UserTokenDTO;
import core.User;
import db.UserDAO;
import db.UserTokenDAO;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;

import java.util.Calendar;
import java.util.Optional;

// TODO caching

public class MyAuthenticator implements Authenticator<String, User> {
    private UserTokenDAO userTokenDAO;
    private UserDAO userDAO;

    public MyAuthenticator(UserTokenDAO userTokenDAO, UserDAO userDAO) {
        this.userTokenDAO = userTokenDAO;
        this.userDAO = userDAO;
    }

    public Optional<User> authenticate(String token) throws AuthenticationException {
        UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromToken(token);
        if (userTokenDTO == null) {
            throw new AuthenticationException("Session key not present or invalid");
        }

        // If token has expired or is invalid throw exception
        if (Calendar.getInstance().getTime().after(userTokenDTO.getLifetimeEnds()) || userTokenDTO.getStatus().equals(UserTokenDTO.Status.INVALID)) {
            throw new AuthenticationException("Token is invalid");
        }

        return Optional.of(userDAO.getUser(userTokenDTO.getUsername()));
    }
}
