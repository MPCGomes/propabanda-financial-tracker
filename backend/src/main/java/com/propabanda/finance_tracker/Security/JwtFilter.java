package com.propabanda.finance_tracker.Security;

import com.propabanda.finance_tracker.service.UserDetailServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends GenericFilter {

    private final JWTUtil jwtUtil;
    private final UserDetailServiceImpl userDetailService;
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    // Paths that should bypass JWT authentication
    private static final List<String> EXCLUDED_PATHS = List.of(
            "/atuh",
            "/api/auth", // Make sure this is included
            "/actuator/health",
            "/error");

    public JwtFilter(JWTUtil jwtUtil, UserDetailServiceImpl userDetailService) {
        this.jwtUtil = jwtUtil;
        this.userDetailService = userDetailService;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Skip processing for OPTIONS and excluded paths
        if ("OPTIONS".equals(method) || EXCLUDED_PATHS.stream().anyMatch(path::startsWith)) {
            logger.info("Bypassing JWT filter for path: {}", path);
            filterChain.doFilter(servletRequest, servletResponse); // Pass the request further in the chain
            return;
        }

        // JWT token validation (for protected routes)
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            logger.info("Found Bearer Token for path: {}", path);

            try {
                if (jwtUtil.isTokenValid(token)) {
                    String document = jwtUtil.getDocumentFromToken(token);
                    var userDetails = userDetailService.loadUserByUsername(document);

                    var auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    logger.info("Authentication successful for user: {}", document);
                } else {
                    logger.warn("Invalid JWT token for path: {}", path);
                }
            } catch (Exception e) {
                logger.error("Error processing token for path {}: {}", path, e.getMessage());
            }
        } else {
            logger.warn("No Authorization header found for protected path: {}", path);
        }

        filterChain.doFilter(servletRequest, servletResponse); // Proceed to the next filter
    }
}