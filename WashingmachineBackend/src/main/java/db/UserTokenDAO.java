package db;

import api.UserTokenDTO;
import db.mappers.UserMapper;
import db.mappers.UserTokenMapper;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.BindBean;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.Mapper;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;

import java.util.Date;

@RegisterMapper(UserTokenMapper.class)
public interface UserTokenDAO {
    @SqlUpdate("CREATE TABLE IF NOT EXISTS user_tokens (" +
            "id SERIAL," +
            "username VARCHAR(100) NOT NULL references users(username)," +
            "token TEXT NOT NULL," +
            "lifetime_ends DATE NOT NULL," +
            "status VARCHAR(7) NOT NULL," +
            "PRIMARY KEY(id)," +
            "UNIQUE(username)" +
            ");")
    void createUserTokenTable();

    @SqlUpdate("INSERT INTO user_tokens (username, token, lifetime_ends, status) " +
            "VALUES (:userTokenDTO.username, :userTokenDTO.token, :userTokenDTO.lifetimeEnds, :userTokenDTO.status)")
    int createUserToken(@BindBean("userTokenDTO") UserTokenDTO userTokenDTO);

    @SqlQuery("SELECT * FROM user_tokens WHERE username = :username")
    UserTokenDTO getUserTokenFromUsername(@Bind("username") String username);

    @SqlQuery("SELECT * FROM user_tokens WHERE token = :userToken")
    UserTokenDTO getUserTokenFromToken(@Bind("userToken") String userToken);

    @SqlQuery("SELECT username FROM user_tokens WHERE token = :token")
    String getUsernameFromToken(@Bind("token") String token);

    @SqlUpdate("DELETE FROM user_tokens WHERE username = :username")
    int deleteUserTokenFromUsername(@Bind("username") String username);

    @SqlUpdate("TRUNCATE TABLE user_tokens")
    void truncateTable();

    @SqlUpdate("UPDATE user_tokens SET lifetime_ends = :time WHERE token = :token")
    int setNewTimeForToken(@Bind("token") String token, @Bind("time") Date time);
}