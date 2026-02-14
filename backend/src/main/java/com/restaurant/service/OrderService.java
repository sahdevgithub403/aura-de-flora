package com.restaurant.service;

import com.restaurant.dto.OrderItemResponse;
import com.restaurant.dto.OrderResponse;
import com.restaurant.model.Order;
import com.restaurant.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

        @Autowired
        private OrderRepository orderRepository;

        public List<OrderResponse> getAllOrders() {
                return orderRepository.findAllWithUserAndItems()
                                .stream()
                                .map(this::mapToOrderResponse)
                                .collect(Collectors.toList());
        }

        public List<OrderResponse> getOrdersByUser(com.restaurant.model.User user) {
                return orderRepository.findByUserOrderByOrderDateDesc(user)
                                .stream()
                                .map(this::mapToOrderResponse)
                                .collect(Collectors.toList());
        }

        public OrderResponse mapToOrderResponse(Order order) {
                List<OrderItemResponse> items = order.getOrderItems() != null ? order.getOrderItems().stream()
                                .map(item -> new OrderItemResponse(
                                                item.getId(),
                                                item.getMenuItem() != null ? item.getMenuItem().getName() : "Unknown",
                                                item.getQuantity(),
                                                item.getPrice()))
                                .collect(Collectors.toList()) : java.util.Collections.emptyList();

                return new OrderResponse(
                                order.getId(),
                                order.getUser() != null ? order.getUser().getUsername() : "Guest",
                                order.getUser() != null ? order.getUser().getFullName() : "Guest",
                                order.getStatus().name(),
                                order.getTotalAmount(),
                                order.getOrderDate(),
                                order.getDeliveryAddress(),
                                order.getPhoneNumber(),
                                items);
        }
}
