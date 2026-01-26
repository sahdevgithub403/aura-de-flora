package com.restaurant.dto;

public class GoogleLoginRequest {
    private String token; // The ID token from Google

    public GoogleLoginRequest() {
    }

    public GoogleLoginRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
