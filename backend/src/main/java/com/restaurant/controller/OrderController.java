package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.model.User;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.UserRepository;
import com.restaurant.repository.MenuItemRepository;
import com.restaurant.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAllWithUserAndItems();
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(Authentication authentication) {
        User user = userRepository.findByUsernameOrEmail(authentication.getName(), authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, Authentication authentication) {
        return orderRepository.findById(id)
                .map(order -> {
                    if (order.getUser().getUsername().equals(authentication.getName()) ||
                            authentication.getAuthorities().stream()
                                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        return ResponseEntity.ok(order);
                    }
                    return ResponseEntity.status(403).<Order>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private MenuItemRepository menuItemRepository;

    @PostMapping
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> createOrder(@Valid @RequestBody Order order, Authentication authentication) {
        System.out.println("Processing order for: " + authentication.getName());
        try {
            User user = userRepository.findByUsernameOrEmail(authentication.getName(), authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            order.setUser(user);
            order.setOrderDate(java.time.LocalDateTime.now());
            order.setStatus(Order.OrderStatus.PENDING);

            if (order.getOrderItems() != null) {
                for (com.restaurant.model.OrderItem item : order.getOrderItems()) {
                    item.setOrder(order);
                    // Fetch full MenuItem to ensure it's attached to the persistence context
                    if (item.getMenuItem() != null && item.getMenuItem().getId() != null) {
                        com.restaurant.model.MenuItem fullItem = menuItemRepository.findById(item.getMenuItem().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "Menu item not found: " + item.getMenuItem().getId()));
                        item.setMenuItem(fullItem);
                    }
                }
            }

            Order savedOrder = orderRepository.save(order);
            System.out.println("Order saved with ID: " + savedOrder.getId());

            // Fetch full order with items and user for WS notification
            orderRepository.findById(savedOrder.getId()).ifPresent(fullOrder -> {
                try {
                    messagingTemplate.convertAndSend("/topic/orders", fullOrder);
                    messagingTemplate.convertAndSend("/topic/admin/stats", adminDashboardService.getStats());
                } catch (Exception wsError) {
                    System.err.println("WebSocket notification failed but order was saved: " + wsError.getMessage());
                }
            });

            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            System.err.println("Order creation failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Order creation failed: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> statusUpdate) {
        String statusStr = statusUpdate.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }

        Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr.toUpperCase());

        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    Order updatedOrder = orderRepository.save(order);

                    try {
                        // Re-fetch or ensure initialization for WS
                        Order fullOrder = orderRepository.findById(updatedOrder.getId()).orElse(updatedOrder);
                        messagingTemplate.convertAndSend("/topic/orders", fullOrder);
                        messagingTemplate.convertAndSend("/topic/admin/stats", adminDashboardService.getStats());

                        // Notify the user specifically
                        if (order.getUser() != null) {
                            messagingTemplate.convertAndSend("/topic/order-status/" + order.getUser().getId(),
                                    fullOrder);
                        }
                    } catch (Exception wsError) {
                        System.err.println("WS notification error: " + wsError.getMessage());
                    }

                    return ResponseEntity.ok(updatedOrder);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}