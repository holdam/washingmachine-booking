package auth;

import api.UserTokenDTO;
import core.User;
import db.UserDAO;
import db.UserTokenDAO;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;


import java.util.Calendar;
import java.util.Optional;

public class MyAuthenticator implements Authenticator<String, User> {
    private UserTokenDAO userTokenDAO;
    private UserDAO userDAO;
    private int tokenLifetime;

    public MyAuthenticator(UserTokenDAO userTokenDAO, UserDAO userDAO, int tokenLifetime) {
        this.userTokenDAO = userTokenDAO;
        this.userDAO = userDAO;
        this.tokenLifetime = tokenLifetime;
    }

    public Optional<User> authenticate(String token) throws AuthenticationException {
        UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromToken(token);
        Calendar calendar = Calendar.getInstance();
        if (userTokenDTO == null) {
            throw new AuthenticationException("Session key not present or invalid");
        }

        // If token has expired or is invalid throw exception
        if (calendar.getTime().after(userTokenDTO.getLifetimeEnds()) || userTokenDTO.getStatus().equals(UserTokenDTO.Status.INVALID)) {
            throw new AuthenticationException("Token is invalid");
        }

        // If token is about to run out, refresh it
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        if (calendar.getTime().after(userTokenDTO.getLifetimeEnds())) {
            calendar.add(Calendar.DAY_OF_YEAR, tokenLifetime - 1);
            userTokenDAO.setNewTimeForToken(userTokenDTO.getToken(), calendar.getTime());
        }

        return Optional.of(userDAO.getUser(userTokenDTO.getUsername()));
    }
}
