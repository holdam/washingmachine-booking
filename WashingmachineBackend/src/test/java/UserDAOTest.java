import core.RoleHelper;
import api.UserDTO;
import db.BookingDAO;
import db.UserDAO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skife.jdbi.v2.DBI;
import org.skife.jdbi.v2.exceptions.UnableToExecuteStatementException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class UserDAOTest {
    private BookingDAO bookingDAO;
    private UserDAO userDAO;
    private final String USERNAME_1 = "user";
    private final String USERNAME_1_ALTERNATIVE = "UsEr";
    private final String USERNAME_2 = "user2";
    private final String USER_1_PASSWORD = "password_that_should_have_been_hashed_and_salted";
    private final String USER_1_SALT = "salt";
    private final String APARTMENT_1 = "apartment";
    private final String NAME_1 = "name";

    @Before
    public void setup() {
        DBI dbi = new DBI("jdbc:postgresql://localhost:5433/test", "postgres", "root");
        bookingDAO = dbi.onDemand(BookingDAO.class);
        userDAO = dbi.onDemand(UserDAO.class);
        userDAO.createRoleTable();
        userDAO.createUsersTable();
    }

    @After
    public void tearDown() throws InterruptedException {
        userDAO.truncateUsersTable();
    }

    @Test
    public void insertUserShouldWork() {
        int numberInserted = userDAO.insertUser(USERNAME_1, USER_1_PASSWORD, USER_1_SALT, NAME_1, APARTMENT_1, RoleHelper.ROLE_DEFAULT);
        assertEquals(1, numberInserted);
    }

    @Test(expected =  UnableToExecuteStatementException.class)
    public void usernamesAreUnique() {
        insertUser1();
        insertUser1();
    }

    @Test
    public void authenticateUserShouldWork() {
        insertUser1();
        boolean login = userDAO.authenticateUser(USERNAME_1, USER_1_PASSWORD);
        assertTrue(login);
        login = userDAO.authenticateUser(USERNAME_2, USER_1_PASSWORD);
        assertFalse(login);
    }

    @Test
    public void getUserShouldWork() {
        insertUser1();
        UserDTO userDTO = userDAO.getUser(USERNAME_1);
        assertEquals(USERNAME_1, userDTO.getName());
        assertEquals(RoleHelper.ROLE_DEFAULT, userDTO.getRole());
        assertEquals(APARTMENT_1, userDTO.getApartment());
        assertEquals(NAME_1, userDTO.getRealName());
        userDTO = userDAO.getUser(USERNAME_2);
        assertEquals(null, userDTO);
    }

    @Test
    public void getSaltForUserShouldWork() {
        insertUser1();
        String salt = userDAO.getSaltForUser(USERNAME_1);
        assertEquals(salt, USER_1_SALT);

        salt = userDAO.getSaltForUser(USERNAME_2);
        assertEquals(null, salt);
    }

    @Test
    public void usernameCasingShouldNotMatterForAuthentication() {
        insertUser1();
        boolean login = userDAO.authenticateUser(USERNAME_1_ALTERNATIVE, USER_1_PASSWORD);
        assertTrue(login);
    }

    @Test
    public void usernameCasingShouldNotMatterForGettingSalt() {
        insertUser1();
        String salt = userDAO.getSaltForUser(USERNAME_1_ALTERNATIVE);
        assertEquals(USER_1_SALT, salt);
    }

    private void insertUser1() {
        userDAO.insertUser(USERNAME_1, USER_1_PASSWORD, USER_1_SALT, NAME_1, APARTMENT_1, RoleHelper.ROLE_DEFAULT);
    }
}
