import api.UserTokenDTO;
import core.RoleHelper;
import core.User;
import core.Util;
import db.UserDAO;
import db.UserTokenDAO;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import resources.AuthResource;
import javax.naming.AuthenticationException;
import javax.ws.rs.core.Response;
import java.util.Calendar;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.junit.Assert.*;


public class AuthResourceTest {
    private static final String PASSWORD = "password";
    private static final String USERNAME = "username";
    private static final String SALT = "salt";
    private static final String TOKEN = "token";
    private AuthResource authResource;
    private UserTokenDAO userTokenDAO;
    private UserDAO userDAO;

    @Before
    public void setup() {
        userTokenDAO = mock(UserTokenDAO.class);
        userDAO = mock(UserDAO.class);
        authResource = new AuthResource(userTokenDAO, userDAO, 123, null);
    }

    @Test(expected = AuthenticationException.class)
    public void nonexistentUserShouldReturnError() throws javax.naming.AuthenticationException {
        when(userDAO.getUser(USERNAME)).thenReturn(null);
        authResource.signIn(USERNAME, "bogus");
    }

    // TODO
    @Test
    public void ifNoTokenAlreadyExistsForUserWeCreateOne() throws AuthenticationException {
        when(userDAO.getUser(USERNAME)).thenReturn(new User(USERNAME, 0));
        when(userDAO.getSaltForUser(USERNAME)).thenReturn(SALT);
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(PASSWORD, SALT);
        when(userDAO.authenticateUser(USERNAME, hashedAndSaltedPassword)).thenReturn(1);
        Response signedInUserToken = authResource.signIn(USERNAME, PASSWORD);
        assertNotNull(signedInUserToken.getCookies().get("userAccessToken").getValue());
    }

    @Test(expected = AuthenticationException.class)
    public void incorrectCredentialsShouldResolveInError() throws AuthenticationException {
        when(userDAO.getUser(USERNAME)).thenReturn(new User(USERNAME, 0));
        when(userDAO.getSaltForUser(USERNAME)).thenReturn(SALT);
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword("wrong_password", SALT);
        when(userDAO.authenticateUser(USERNAME, hashedAndSaltedPassword)).thenReturn(1);
        authResource.signIn(USERNAME, PASSWORD);
    }

    @Test
    public void ifTokenAlreadyExistsWithMoreThan1DayLeftOnItNoNewTokenShouldBeCreated() throws AuthenticationException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 2);
        when(userTokenDAO.getUserTokenFromUsername(USERNAME)).thenReturn(new UserTokenDTO(USERNAME, TOKEN, calendar.getTime(), UserTokenDTO.Status.VALID));

        when(userDAO.getUser(USERNAME)).thenReturn(new User(USERNAME, RoleHelper.ROLE_DEFAULT));
        when(userDAO.authenticateUser(Mockito.contains(USERNAME), Mockito.anyString())).thenReturn(1);
        Response signedInUserToken = authResource.signIn(USERNAME, PASSWORD);
        assertEquals(TOKEN, signedInUserToken.getCookies().get("userAccessToken").getValue());
    }

    @Test
    public void ifTokenAlreadyExistsWithLessThan1DayLeftOnItANewTokenShouldBeCreated() throws AuthenticationException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR_OF_DAY, 23);
        when(userTokenDAO.getUserTokenFromUsername(USERNAME)).thenReturn(new UserTokenDTO(USERNAME, TOKEN, calendar.getTime(), UserTokenDTO.Status.VALID));

        when(userDAO.getUser(USERNAME)).thenReturn(new User(USERNAME, RoleHelper.ROLE_DEFAULT));
        when(userDAO.authenticateUser(Mockito.contains(USERNAME), Mockito.anyString())).thenReturn(1);
        Response signedInUserToken = authResource.signIn(USERNAME, PASSWORD);
        assertNotEquals(TOKEN, signedInUserToken.getCookies().get("userAccessToken").getValue());
    }
}
