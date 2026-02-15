package com.restaurant.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationInMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return generateTokenFromUsername(userPrincipal.getUsername());
    }

    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            System.out.println("DEBUG JWT VALIDATE: Token EXPIRED - " + ex.getMessage());
            return false;
        } catch (SignatureException ex) {
            System.out.println("DEBUG JWT VALIDATE: SIGNATURE MISMATCH - " + ex.getMessage());
            return false;
        } catch (MalformedJwtException ex) {
            System.out.println("DEBUG JWT VALIDATE: MALFORMED token - " + ex.getMessage());
            return false;
        } catch (UnsupportedJwtException ex) {
            System.out.println("DEBUG JWT VALIDATE: UNSUPPORTED token - " + ex.getMessage());
            return false;
        } catch (JwtException | IllegalArgumentException ex) {
            System.out.println(
                    "DEBUG JWT VALIDATE: OTHER error - " + ex.getClass().getSimpleName() + ": " + ex.getMessage());
            return false;
        }
    }
}