import api.SuccessDTO;
import api.UserDTO;
import core.RoleHelper;
import db.UserDAO;
import db.UserTokenDAO;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import resources.UserResource;
import static org.junit.Assert.*;
import static org.mockito.Mockito.when;


import javax.naming.AuthenticationException;
import javax.ws.rs.core.Cookie;

public class UserResourceTest {
    UserResource userResource;
    UserDAO userDAO;
    UserTokenDAO userTokenDAO;
    private final String USERNAME_1 = "username";
    private final String PASSWORD_1 = "password";
    private final String NAME_1 = "name";
    private final String APARTMENT_1 = "apartment";

    @Before
    public void setup() {
        userDAO = Mockito.mock(UserDAO.class);
        userTokenDAO = Mockito.mock(UserTokenDAO.class);
        userResource = new UserResource(userDAO, userTokenDAO);
    }

    @Test(expected = AuthenticationException.class)
    public void passwordCannotBeEmpty() throws AuthenticationException {
        userResource.createUser(USERNAME_1, "", "bogus", "bogus");
    }

    @Test(expected = AuthenticationException.class)
    public void usernameCannotBeEmpty() throws AuthenticationException {
        userResource.createUser("", PASSWORD_1, "bogus", "bogus");
    }

    @Test(expected = AuthenticationException.class)
    public void nameCannotBeEmpty() throws AuthenticationException {
        userResource.createUser("bogus", "bogus", "", "bogus");
    }

    @Test(expected = AuthenticationException.class)
    public void apartmentCannotBeEmpty() throws AuthenticationException {
        userResource.createUser("bogus", "bogus", "bogus", "");
    }

    @Test
    public void shouldBeAbleToCreateUser() throws AuthenticationException {
        UserDTO userDTO = userResource.createUser(USERNAME_1, PASSWORD_1, NAME_1, APARTMENT_1);
        assertEquals(USERNAME_1, userDTO.getName());
        assertEquals(APARTMENT_1, userDTO.getApartment());
        assertEquals(NAME_1, userDTO.getRealName());
    }

    @Test
    public void doesUsernameExistAlreadyShouldWork() {
        SuccessDTO success = userResource.doesUsernameExistAlready(USERNAME_1);
        assertEquals(true, success.isSuccess());
        when(userDAO.getUser(USERNAME_1)).thenReturn(new UserDTO(USERNAME_1, RoleHelper.ROLE_DEFAULT, NAME_1, APARTMENT_1));
        success = userResource.doesUsernameExistAlready(USERNAME_1);
        assertEquals(false, success.isSuccess());
    }

    @Test
    public void userFromUserAccessTokenShouldWork() {
        when(userTokenDAO.getUsernameFromToken("token")).thenReturn(USERNAME_1);
        when(userDAO.getUser(USERNAME_1)).thenReturn(new UserDTO(USERNAME_1, RoleHelper.ROLE_DEFAULT, NAME_1, APARTMENT_1));
        UserDTO userDTO = userResource.userFromUserAccessToken(new Cookie("token", "token"));
        assertEquals(USERNAME_1, userDTO.getName());
        assertEquals(RoleHelper.ROLE_DEFAULT, userDTO.getRole());
    }
}
