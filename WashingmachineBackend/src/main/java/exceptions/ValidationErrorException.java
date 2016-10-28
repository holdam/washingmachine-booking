package exceptions;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class ValidationErrorException extends WebApplicationException {
    public ValidationErrorException() {
        super(Response.status(Response.Status.BAD_REQUEST).build());
    }
}
