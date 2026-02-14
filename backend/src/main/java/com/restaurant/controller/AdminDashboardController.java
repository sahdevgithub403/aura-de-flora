package com.restaurant.controller;

import com.restaurant.dto.AdminStatsDTO;
import com.restaurant.model.Order;
import com.restaurant.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getStats());
    }

    @GetMapping("/orders/recent")
    public ResponseEntity<List<Order>> getRecentOrders(@RequestParam(defaultValue = "5") int limit,
            org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok(adminDashboardService.getRecentOrders(limit));
    }

    @GetMapping("/analytics/revenue")
    public ResponseEntity<?> getRevenueAnalytics() {
        return ResponseEntity.ok(java.util.List.of(
                java.util.Map.of("date", "2024-03-01", "revenue", 1200),
                java.util.Map.of("date", "2024-03-02", "revenue", 1500),
                java.util.Map.of("date", "2024-03-03", "revenue", 1100),
                java.util.Map.of("date", "2024-03-04", "revenue", 1800),
                java.util.Map.of("date", "2024-03-05", "revenue", 2100)));
    }
}
