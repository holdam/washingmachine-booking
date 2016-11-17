package filters;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import java.io.IOException;

public class CSRFFilter implements ContainerRequestFilter {
    private String targetOrigin;

    public CSRFFilter(String targetOrigin) {
        this.targetOrigin = targetOrigin;
    }

    @Override
    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
        // TODO may need to use "origin" as well - come back when HTTPS is implemented
        if (!containerRequestContext.getHeaders().getFirst("Referer").contains(targetOrigin) &&
                !containerRequestContext.getHeaders().getFirst("Origin").contains(targetOrigin)) {
            containerRequestContext.abortWith(Response.status(Response.Status.FORBIDDEN).build());
        }
    }
}
