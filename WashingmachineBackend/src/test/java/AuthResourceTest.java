import api.UserTokenDTO;
import core.RoleHelper;
import api.UserDTO;
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
    private final String PASSWORD = "password";
    private final String USERNAME = "username";
    private final String SALT = "salt";
    private final String TOKEN = "token";
    private final String NAME = "name";
    private final String APARTMENT = "apartment";
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

    @Test
    public void ifNoTokenAlreadyExistsForUserWeCreateOne() throws AuthenticationException {
        when(userDAO.getUser(USERNAME)).thenReturn(new UserDTO(USERNAME, RoleHelper.ROLE_DEFAULT, NAME, APARTMENT));
        when(userDAO.getSaltForUser(USERNAME)).thenReturn(SALT);
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword(PASSWORD, SALT);
        when(userDAO.authenticateUser(USERNAME, hashedAndSaltedPassword)).thenReturn(true);
        Response signedInUserToken = authResource.signIn(USERNAME, PASSWORD);
        assertNotNull(signedInUserToken.getCookies().get("userAccessToken").getValue());
    }

    @Test(expected = AuthenticationException.class)
    public void incorrectCredentialsShouldResolveInError() throws AuthenticationException {
        when(userDAO.getUser(USERNAME)).thenReturn(new UserDTO(USERNAME, RoleHelper.ROLE_DEFAULT, NAME, APARTMENT));
        when(userDAO.getSaltForUser(USERNAME)).thenReturn(SALT);
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword("wrong_password", SALT);
        when(userDAO.authenticateUser(USERNAME, hashedAndSaltedPassword)).thenReturn(true);
        authResource.signIn(USERNAME, PASSWORD);
    }

    @Test
    public void ifTokenAlreadyExistsWithMoreThan1DayLeftOnItNoNewTokenShouldBeCreated() throws AuthenticationException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 2);
        when(userTokenDAO.getUserTokenFromUsername(USERNAME)).thenReturn(new UserTokenDTO(USERNAME, TOKEN, calendar.getTime(), UserTokenDTO.Status.VALID));

        when(userDAO.getUser(USERNAME)).thenReturn(new UserDTO(USERNAME, RoleHelper.ROLE_DEFAULT, NAME, APARTMENT));
        when(userDAO.authenticateUser(Mockito.contains(USERNAME), Mockito.anyString())).thenReturn(true);
        Response signedInUserToken = authResource.signIn(USERNAME, PASSWORD);
        assertEquals(TOKEN, signedInUserToken.getCookies().get("userAccessToken").getValue());
    }

    @Test
    public void ifTokenAlreadyExistsWithLessThan1DayLeftOnItANewTokenShouldBeCreated() throws AuthenticationException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR_OF_DAY, 23);
        when(userTokenDAO.getUserTokenFromUsername(USERNAME)).thenReturn(new UserTokenDTO(USERNAME, TOKEN, calendar.getTime(), UserTokenDTO.Status.VALID));

        when(userDAO.getUser(USERNAME)).thenReturn(new UserDTO(USERNAME, RoleHelper.ROLE_DEFAULT, NAME, APARTMENT));
        when(userDAO.authenticateUser(Mockito.contains(USERNAME), Mockito.anyString())).thenReturn(true);
        Response signedInUserToken = authResource.signIn(USERNAME, PASSWORD);
        assertNotEquals(TOKEN, signedInUserToken.getCookies().get("userAccessToken").getValue());
    }
}
