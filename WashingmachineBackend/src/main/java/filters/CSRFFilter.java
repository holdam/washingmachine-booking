package filters;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;

public class CSRFFilter implements ContainerRequestFilter {
    private List<String> targetsOrigin;

    public CSRFFilter(List targetsOrigin) {
        this.targetsOrigin = targetsOrigin;
    }

    @Override
    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
        // TODO may need to use "origin" as well - come back when HTTPS is implemented
        boolean targetExists = false;
        for (String targetOrigin : targetsOrigin) {
            String referer = containerRequestContext.getHeaders().getFirst("Referer");
            String origin = containerRequestContext.getHeaders().getFirst("Origin");

            if ((referer != null && referer.contains(targetOrigin) || (origin != null && origin.contains(targetOrigin)))) {
                targetExists = true;
                break;
            }
        }

        if (!targetExists) {
            containerRequestContext.abortWith(Response.status(Response.Status.FORBIDDEN).build());
        }
    }
}
