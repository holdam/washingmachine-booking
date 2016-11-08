import auth.MyAuthenticator;
import core.User;
import db.BookingDAO;
import db.UserDAO;
import db.UserTokenDAO;
import io.dropwizard.Application;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.jdbi.DBIFactory;
import io.dropwizard.setup.Environment;
import org.skife.jdbi.v2.DBI;
import resources.AuthResource;
import resources.BookingResource;
import resources.UserResource;

public class MyApplication extends Application<MyConfiguration> {

    public static void main(String[] args) throws Exception {
        new MyApplication().run(args);
    }

    public void run(MyConfiguration config, Environment environment) throws Exception {
        final DBIFactory factory = new DBIFactory();
        final DBI jdbi = factory.build(environment, config.getDataSourceFactory(), "postgresql");
        final BookingDAO bookingDAO = jdbi.onDemand(BookingDAO.class);
        final UserDAO userDAO = jdbi.onDemand(UserDAO.class);
        final UserTokenDAO userTokenDAO = jdbi.onDemand(UserTokenDAO.class);

        // Sets up tables if they don't exist
        userDAO.createRoleTable();
        userDAO.createUsersTable();
        bookingDAO.createBookingTable();
        userTokenDAO.createUserTokenTable();

        environment.jersey().register(new AuthDynamicFeature(
                new OAuthCredentialAuthFilter.Builder<User>()
                .setAuthenticator(new MyAuthenticator(userTokenDAO, userDAO))
                .setPrefix("token")
                .buildAuthFilter()));

        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));
        environment.jersey().register(new BookingResource(bookingDAO));
        environment.jersey().register(new UserResource(userDAO, userTokenDAO));
        environment.jersey().register(new AuthResource(userTokenDAO, userDAO));
    }
}
