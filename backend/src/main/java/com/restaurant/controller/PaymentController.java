package com.restaurant.controller;

import com.restaurant.dto.PaymentRequest;
import com.restaurant.dto.PaymentVerificationRequest;
import com.restaurant.service.PaymentService;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            String orderJson = paymentService.createOrder(paymentRequest.getAmount(), paymentRequest.getCurrency());

            // Add key to response for frontend
            JSONObject response = new JSONObject(orderJson);
            response.put("key", paymentService.getKeyId());

            // Map Razorpay's internal 'id' to 'orderId' if needed by frontend
            if (response.has("id")) {
                response.put("orderId", response.getString("id"));
            }

            return ResponseEntity.ok(response.toString());
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest) {
        try {
            boolean isValid = paymentService.verifyPayment(
                    verificationRequest.getRazorpayOrderId(),
                    verificationRequest.getRazorpayPaymentId(),
                    verificationRequest.getRazorpaySignature());

            if (isValid) {
                return ResponseEntity.ok().body("{\"verified\": true}");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("{\"verified\": false, \"message\": \"Invalid signature\"}");
            }
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}