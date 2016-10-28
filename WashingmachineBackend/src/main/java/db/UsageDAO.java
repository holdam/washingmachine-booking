package db;

import api.Usage;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;

import java.util.Date;
import java.util.List;

@RegisterMapper(UsageMapper.class)
public interface UsageDAO {

    /**
     * Keeps track of number of washes or tumble dries in a given month
     */

    @SqlUpdate("CREATE TABLE IF NOT EXISTS usage (" +
            "id SERIAL," +
            "owner VARCHAR(100) NOT NULL references users(username)," +
            "type VARCHAR(30) NOT NULL ," +
            "counter SMALLINT NOT NULL," +
            "start_date DATE NOT NULL," +
            "CONSTRAINT usage_unique UNIQUE(owner, type, start_date)," +
            "PRIMARY KEY(id)" +
            ");")
    void createUsageTable();

    @SqlUpdate("INSERT INTO usage (owner, type, start_date, counter) VALUES (:username, :type, :startDateOfMonth, 1) " +
            "ON CONFLICT ON CONSTRAINT usage_unique DO UPDATE SET counter = usage.counter + 1 " +
            "WHERE usage.owner = :username AND usage.type = :type AND usage.start_date = :startDateOfMonth")
    void insertUsage(@Bind("username") String username, @Bind("type") String type, @Bind("startDateOfMonth") Date startDateOfMonth);

    @SqlUpdate("UPDATE usage SET counter = counter - 1 WHERE owner = :username AND type = :type AND start_date = :startDateOfMonth AND counter > 0")
    void deleteUsage(@Bind("username") String username, @Bind("type") String type, @Bind("startDateOfMonth") Date startDateOfMonth);

    @SqlQuery("SELECT counter, type, owner FROM usage WHERE start_date < :endDate AND :startDate <= start_date AND owner = :username")
    List<Usage> getUsageForUserInInterval(@Bind("username") String username, @Bind("startDate") Date startDate, @Bind("endDate") Date endDate);

    @SqlQuery("SELECT counter, type, owner FROM usage WHERE start_date < :endDate AND :startDate <= start_date")
    List<Usage> getAllUsagesInInterval(@Bind("startDate") Date startDate, @Bind("endDate") Date endDate);
}
