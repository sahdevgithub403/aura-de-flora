package com.restaurant.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private String username;
    private String fullName;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime orderDate;
    private String deliveryAddress;
    private String phoneNumber;
    private List<OrderItemResponse> orderItems;

    public OrderResponse(Long id, String username, String fullName,
            String status, BigDecimal totalAmount,
            LocalDateTime orderDate, String deliveryAddress,
            String phoneNumber, List<OrderItemResponse> orderItems) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        this.orderItems = orderItems;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<OrderItemResponse> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemResponse> orderItems) {
        this.orderItems = orderItems;
    }
}
