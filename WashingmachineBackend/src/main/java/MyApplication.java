import auth.MyAuthenticator;
import core.User;
import db.EventDAO;
import db.UsageDAO;
import db.UserDAO;
import io.dropwizard.Application;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.basic.BasicCredentialAuthFilter;
import io.dropwizard.jdbi.DBIFactory;
import io.dropwizard.setup.Environment;
import org.skife.jdbi.v2.DBI;
import resources.EventResource;
import resources.UsageResource;
import resources.UserResource;

public class MyApplication extends Application<MyConfiguration> {

    public static void main(String[] args) throws Exception {
        new MyApplication().run(args);
    }

    public void run(MyConfiguration config, Environment environment) throws Exception {
        final DBIFactory factory = new DBIFactory();
        final DBI jdbi = factory.build(environment, config.getDataSourceFactory(), "postgresql");
        final EventDAO eventDAO = jdbi.onDemand(EventDAO.class);
        final UserDAO userDAO = jdbi.onDemand(UserDAO.class);
        final UsageDAO usageDAO = jdbi.onDemand(UsageDAO.class);

        // Sets up tables
        userDAO.createRoleTable();
        userDAO.createUsersTable();
        eventDAO.createEventTable();
        usageDAO.createUsageTable();

        environment.jersey().register(new AuthDynamicFeature(new BasicCredentialAuthFilter.Builder<User>()
                .setAuthenticator(new MyAuthenticator(userDAO))
                .setRealm("SUPER SECRET STUFF")
                .buildAuthFilter()));
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(User.class));
        environment.jersey().register(new EventResource(eventDAO));
        environment.jersey().register(new UserResource(userDAO));
        environment.jersey().register(new UsageResource(usageDAO));
    }
}
