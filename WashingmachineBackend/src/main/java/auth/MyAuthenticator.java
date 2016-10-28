package auth;

import com.sun.org.apache.xerces.internal.impl.dv.util.HexBin;
import core.User;
import core.Util;
import db.UserDAO;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;
import io.dropwizard.auth.basic.BasicCredentials;
import org.apache.commons.lang3.RandomStringUtils;

import java.security.MessageDigest;
import java.util.Optional;


public class MyAuthenticator implements Authenticator<BasicCredentials, User> {
    private UserDAO userDAO;

    public MyAuthenticator(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public Optional<User> authenticate(BasicCredentials basicCredentials) throws AuthenticationException {
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(basicCredentials.getPassword(), userDAO.getSaltForUser(basicCredentials.getUsername()));
        if (userDAO.authenticateUser(basicCredentials.getUsername(), hashedAndSaltedPassword) > 0) {
            return Optional.of(new User(basicCredentials.getUsername(), userDAO.getRoleForUser(basicCredentials.getUsername())));
        }
        return Optional.empty();
    }
}
