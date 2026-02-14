package com.restaurant.dto;

import java.math.BigDecimal;

public class AdminStatsDTO {
    private long totalOrdersToday;
    private long pendingOrders;
    private BigDecimal totalRevenue;
    private double avgOrderValue;
    private int activeTables; // Placeholder for now
    private double averageRating;
    private long totalReviews;
    private long customerFeedbackCount;

    public AdminStatsDTO(long totalOrdersToday, long pendingOrders, BigDecimal totalRevenue, double avgOrderValue,
            int activeTables, double averageRating, long totalReviews, long customerFeedbackCount) {
        this.totalOrdersToday = totalOrdersToday;
        this.pendingOrders = pendingOrders;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.avgOrderValue = avgOrderValue;
        this.activeTables = activeTables;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.customerFeedbackCount = customerFeedbackCount;
    }

    public double getAvgOrderValue() {
        return avgOrderValue;
    }

    public void setAvgOrderValue(double avgOrderValue) {
        this.avgOrderValue = avgOrderValue;
    }

    // Getters and Setters
    public long getTotalOrdersToday() {
        return totalOrdersToday;
    }

    public void setTotalOrdersToday(long totalOrdersToday) {
        this.totalOrdersToday = totalOrdersToday;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public int getActiveTables() {
        return activeTables;
    }

    public void setActiveTables(int activeTables) {
        this.activeTables = activeTables;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public long getCustomerFeedbackCount() {
        return customerFeedbackCount;
    }

    public void setCustomerFeedbackCount(long customerFeedbackCount) {
        this.customerFeedbackCount = customerFeedbackCount;
    }
}
