package core;

import com.sun.org.apache.xerces.internal.impl.dv.util.HexBin;
import org.apache.commons.lang3.RandomStringUtils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.Date;

public class Util {
    public static String getHashedAndSaltedPassword(String password, String salt) {
        MessageDigest messageDigest = null;
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
            return HexBin.encode(messageDigest.digest((password + salt).getBytes()));
        } catch (NoSuchAlgorithmException e) {
            // Should never happen
            e.printStackTrace();
        }
        // Should never happen
        return null;
    }

    public static Date convertMillisToDate(long millis) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(millis);
        return calendar.getTime();
    }
}
