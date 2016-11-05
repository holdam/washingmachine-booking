package db.mappers;

import api.UserTokenDTO;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserTokenMapper implements ResultSetMapper<UserTokenDTO> {

    @Override
    public UserTokenDTO map(int i, ResultSet resultSet, StatementContext statementContext) throws SQLException {
        return new UserTokenDTO(resultSet.getString("username"), resultSet.getString("token"), resultSet.getDate("lifetime_ends"),
                UserTokenDTO.Status.getValueFromString(resultSet.getString("status")));
    }
}
