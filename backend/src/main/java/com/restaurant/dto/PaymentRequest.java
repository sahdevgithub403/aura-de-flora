package com.restaurant.dto;

import java.util.List;

public class PaymentRequest {
    private List<OrderItemRequest> orderItems;
    private String deliveryAddress;
    private String phoneNumber;
    private String paymentMethod;

    public static class OrderItemRequest {
        private Long menuItemId;
        private Integer quantity;
        private Double price;

        public OrderItemRequest() {}

        public OrderItemRequest(Long menuItemId, Integer quantity, Double price) {
            this.menuItemId = menuItemId;
            this.quantity = quantity;
            this.price = price;
        }

        public Long getMenuItemId() { return menuItemId; }
        public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
    }

    public PaymentRequest() {}

    public List<OrderItemRequest> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemRequest> orderItems) { this.orderItems = orderItems; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}