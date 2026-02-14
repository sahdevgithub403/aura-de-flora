package com.restaurant.service;

import com.restaurant.dto.AdminStatsDTO;
import com.restaurant.dto.OrderResponse;
import com.restaurant.model.Order;
import com.restaurant.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    @Lazy
    private OrderService orderService;

    public List<OrderResponse> getRecentOrders(int limit) {
        return orderRepository.findAll(PageRequest.of(0, limit, Sort.by("orderDate").descending()))
                .getContent()
                .stream()
                .map(orderService::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public AdminStatsDTO getStats() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);

        long totalOrdersToday = orderRepository.countByOrderDateAfter(startOfDay);
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        BigDecimal totalRevenue = orderRepository.sumTotalAmount();
        if (totalRevenue == null)
            totalRevenue = BigDecimal.ZERO;

        long totalOrders = orderRepository.count();
        double avgOrderValue = totalOrders > 0 ? totalRevenue.doubleValue() / totalOrders : 0;

        // Standard mock values as used in the controller
        int activeTables = 8;
        double averageRating = 4.6;
        long totalReviews = 1234;
        long customerFeedbackCount = 85;

        return new AdminStatsDTO(
                totalOrdersToday,
                pendingOrders,
                totalRevenue,
                avgOrderValue,
                activeTables,
                averageRating,
                totalReviews,
                customerFeedbackCount);
    }
}
