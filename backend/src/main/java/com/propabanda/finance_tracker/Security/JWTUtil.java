package com.propabanda.finance_tracker.Security;

import com.propabanda.finance_tracker.model.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JWTUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        String token = Jwts.builder()
                .setSubject(user.getDocumentNumber())
                .claim("name", user.getName())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

        System.out.println("Generated token: " + token);
        return token;
    }

    public String getDocumentFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Long getUserIdFromToken(String token) {
        try {
            Object userIdClaim = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("userId");

            System.out.println("UserID claim from token: " + userIdClaim);
            System.out.println("UserID claim type: " + (userIdClaim != null ? userIdClaim.getClass() : "null"));

            if (userIdClaim == null) {
                return null;
            }

            // Handle both String and Number types
            if (userIdClaim instanceof Number) {
                return ((Number) userIdClaim).longValue();
            } else if (userIdClaim instanceof String) {
                return Long.parseLong((String) userIdClaim);
            }

            return null;
        } catch (Exception e) {
            System.out.println("Error extracting userId from token: " + e.getMessage());
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        try {
            getDocumentFromToken(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}