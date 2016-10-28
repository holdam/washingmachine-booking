package db;

import core.User;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;


@RegisterMapper(UserMapper.class)
public interface UserDAO {

    @SqlUpdate("CREATE TABLE IF NOT EXISTS users (" +
            "id SERIAL," +
            "username varchar(100) NOT NULL," +
            "password varchar(250) NOT NULL," +
            "salt varchar(50) NOT NULL," +
            "role smallint NOT NULL references roles(id)," +
            "UNIQUE(username)," +
            "PRIMARY KEY(id)" +
            ");")
    void createUsersTable();

    @SqlUpdate("CREATE TABLE IF NOT EXISTS roles (" +
            "id SERIAL," +
            "role_name varchar(10) NOT NULL," +
            "UNIQUE(id)," +
            "PRIMARY KEY(id)" +
            ");" +
            "INSERT INTO roles (id, role_name) VALUES (0, 'admin') ON CONFLICT DO NOTHING;" +
            "INSERT INTO roles (id, role_name) VALUES (1, 'default') ON CONFLICT DO NOTHING;")
    void createRoleTable();

    @SqlUpdate("INSERT INTO users (username, password, salt, role) VALUES (:username, :password, :salt, :role)")
    void insertUser(@Bind("username") String username, @Bind("password") String password, @Bind("salt") String salt, @Bind("role") int role);

    @SqlQuery("SELECT CASE WHEN COUNT(users.id) > 0 THEN 1 ELSE 0 END " +
            "FROM users WHERE username = :username AND password = :password")
    int authenticateUser(@Bind("username") String username, @Bind("password") String password);


    @SqlQuery("SELECT users.username as username, role.role_name as role FROM username JOIN roles ON roles.id = roles WHERE username = :username")
    User getUser(String username);

    @SqlQuery("SELECT salt FROM users WHERE username = :username")
    String getSaltForUser(@Bind("username") String username);

    @SqlQuery("SELECT role FROM users WHERE username = :username")
    int getRoleForUser(@Bind("username") String username);
}