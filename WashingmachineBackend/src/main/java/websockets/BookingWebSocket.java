package websockets;


import org.eclipse.jetty.server.ConnectionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint("/ws-booking")
public class BookingWebSocket {

    public BookingWebSocket() {

    }

    private Logger log = LoggerFactory.getLogger(BookingWebSocket.class);
    private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());

    @OnOpen
    public void onOpen(final Session session) {
        BookingWebSocket.sessions.add(session);
    }

    @OnClose
    public void onClose(final Session session) {
        BookingWebSocket.sessions.remove(session);
    }

    @OnError
    public void onError() {

    }


    // TODO OnMessage instead?
}
