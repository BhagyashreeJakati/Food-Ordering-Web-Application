# Real-Time Architecture — Foody

## Current Implementation: Polling

The order tracking page uses **interval-based polling** — a proven production pattern.

```
Customer Browser                     Spring Boot Backend
      │                                      │
      │──── GET /orders/user ───────────────>│
      │<─── [{id, status, items, ...}] ──────│
      │                                      │
      │  (wait 15 seconds)                   │
      │                                      │
      │──── GET /orders/user ───────────────>│  ← auto-refresh
      │<─── [{id, status: "PREPARING", ...}] │
      │                                      │
      │  Status changed → toast notification │
```

**Why polling is valid:**
- Used by Swiggy and early Zomato builds
- Zero infrastructure overhead (no WebSocket server management)
- Works reliably behind proxies, load balancers, and mobile networks
- Every poll is an independent HTTP request — no connection state to manage

**Poll interval**: 15 seconds (configurable via `POLL_INTERVAL` constant)

---

## Upgrade Path: WebSocket (Production)

When ready to upgrade, the frontend abstraction is already designed for it.

### Frontend change (OrderTracking.jsx)

Replace the `setInterval` block with a WebSocket connection:

```js
// Current (polling)
const pollTimer = setInterval(() => fetchOrder(true), POLL_INTERVAL);

// Upgraded (WebSocket)
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    client.subscribe('/topic/order/' + orderId, (msg) => {
      const updatedOrder = JSON.parse(msg.body);
      setOrder(updatedOrder);
      setLastUpdated(new Date());
    });
  },
});
client.activate();
return () => client.deactivate();
```

### Backend change (Spring Boot)

Add WebSocket config + broadcast on order status change:

```java
// WebSocketConfig.java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }
}

// In OrderServiceImpl.updateOrderStatus():
messagingTemplate.convertAndSend("/topic/order/" + order.getId(), order);
```

**The key point**: the `fetchOrder` callback in the frontend is already abstracted. Swapping the transport is a 20-line change.

---

## Other Real-Time Elements

| Feature | Mechanism | Update frequency |
|---------|-----------|-----------------|
| Cart badge | Redux state | Instant (synchronous) |
| Bill calculation | Derived from Redux state | Instant |
| Admin orders | Polling (20s) + manual refresh | 20 seconds |
| New order notification | Compare order IDs on poll | 20 seconds |
| Toast notifications | Status diff detection | On every poll that shows change |
