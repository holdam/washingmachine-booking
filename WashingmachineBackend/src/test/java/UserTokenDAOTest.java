import api.UserTokenDTO;
import core.RoleHelper;
import core.User;
import db.BookingDAO;
import db.UserDAO;
import db.UserTokenDAO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skife.jdbi.v2.DBI;
import org.skife.jdbi.v2.exceptions.UnableToExecuteStatementException;

import java.util.Date;

import static org.junit.Assert.assertEquals;

public class UserTokenDAOTest {
    private UserDAO userDAO;
    private UserTokenDAO userTokenDAO;
    private final String USERNAME_1 = "user";
    private final String USERNAME_2 = "user2";
    private final String USER_1_PASSWORD = "password_that_should_have_been_hashed_and_salted";
    private final String USER_1_SALT = "salt";
    private final String USER_1_TOKEN = "token";

    @Before
    public void setup() {
        DBI dbi = new DBI("jdbc:postgresql://localhost:5433/test", "postgres", "root");
        userDAO = dbi.onDemand(UserDAO.class);
        userTokenDAO = dbi.onDemand(UserTokenDAO.class);
        userDAO.createRoleTable();
        userDAO.createUsersTable();
        userTokenDAO.createUserTokenTable();
        userDAO.insertUser(USERNAME_1, USER_1_PASSWORD, "bogus", RoleHelper.ROLE_DEFAULT);

    }

    @After
    public void tearDown() {
        userTokenDAO.truncateTable();
        userDAO.truncateUsersTable();
    }

    @Test
    public void createUserTokenShouldWork() {
        int numberInserted = insertUserTokenForUser1();
        assertEquals(1, numberInserted);
    }

    @Test
    public void getUserTokenFromUsernameShouldWork() {
        insertUserTokenForUser1();
        UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromUsername(USERNAME_1);
        assertEquals(UserTokenDTO.Status.VALID, userTokenDTO.getStatus());
        assertEquals(USER_1_TOKEN, userTokenDTO.getToken());
        assertEquals(USERNAME_1, userTokenDTO.getUsername());

        userTokenDTO = userTokenDAO.getUserTokenFromUsername(USERNAME_2);
        assertEquals(null, userTokenDTO);
    }

    @Test
    public void getUserTokenFromTokenShouldWork() {
        insertUserTokenForUser1();
        UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromToken(USER_1_TOKEN);
        assertEquals(UserTokenDTO.Status.VALID, userTokenDTO.getStatus());
        assertEquals(USER_1_TOKEN, userTokenDTO.getToken());
        assertEquals(USERNAME_1, userTokenDTO.getUsername());

        userTokenDTO = userTokenDAO.getUserTokenFromUsername("bogus");
        assertEquals(null, userTokenDTO);
    }

    @Test
    public void deleteUserTokenFromUsernameShouldWork() {
        insertUserTokenForUser1();
        int numberDeleted = userTokenDAO.deleteUserTokenFromUsername(USERNAME_1);
        assertEquals(1, numberDeleted);
        numberDeleted = userTokenDAO.deleteUserTokenFromUsername(USERNAME_1);
        assertEquals(0, numberDeleted);
    }

    private int insertUserTokenForUser1() {
        UserTokenDTO userTokenDTO = new UserTokenDTO(USERNAME_1, USER_1_TOKEN, new Date(), UserTokenDTO.Status.VALID);
        return userTokenDAO.createUserToken(userTokenDTO);
    }
}