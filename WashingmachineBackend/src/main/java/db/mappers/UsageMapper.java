package db.mappers;

import api.UsageDTO;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UsageMapper implements ResultSetMapper<UsageDTO> {
    @Override
    public UsageDTO map(int i, ResultSet resultSet, StatementContext statementContext) throws SQLException {
        return new UsageDTO(resultSet.getString("type"), resultSet.getInt("counter"), resultSet.getString("owner"));
    }
}
