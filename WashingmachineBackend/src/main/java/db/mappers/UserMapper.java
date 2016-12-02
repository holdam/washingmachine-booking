package db.mappers;

import api.UserDTO;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserMapper implements ResultSetMapper<UserDTO> {
    @Override
    public UserDTO map(int i, ResultSet resultSet, StatementContext statementContext) throws SQLException {
        return new UserDTO(resultSet.getString("username"), resultSet.getInt("role"),
                resultSet.getString("name"), resultSet.getString("apartment"));
    }
}
