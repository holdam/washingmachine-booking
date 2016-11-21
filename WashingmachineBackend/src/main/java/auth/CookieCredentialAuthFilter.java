package auth;

import io.dropwizard.auth.AuthFilter;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Cookie;
import java.io.IOException;
import java.security.Principal;
import java.util.Map;

public class CookieCredentialAuthFilter<P extends Principal> extends AuthFilter<String, P> {
    public CookieCredentialAuthFilter() {

    }

    @Override
    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
        for (Map.Entry<String, Cookie> credential : containerRequestContext.getCookies().entrySet()) {
            if(!this.authenticate(containerRequestContext, credential.getValue().getValue(), "BASIC")) {
                throw new WebApplicationException(this.unauthorizedHandler.buildResponse(this.prefix, this.realm));
            }
        }
    }

    public static class Builder<P extends Principal> extends AuthFilterBuilder<String, P, CookieCredentialAuthFilter<P>> {
        public Builder() {
        }

        protected CookieCredentialAuthFilter<P> newInstance() {
            return new CookieCredentialAuthFilter();
        }
    }
}
