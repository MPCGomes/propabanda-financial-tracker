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

    // Updated to include both possible paths
    private static final List<String> EXCLUDED_PATHS = List.of("/api/auth", "/auth");

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

        logger.info("Processing request path: " + path);

        // Check if the path should be excluded from JWT filtering
        if (EXCLUDED_PATHS.stream().anyMatch(path::startsWith)) {
            logger.info("Bypassing JWT filter for path: " + path);
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            logger.info("Found Bearer Token: " + token);

            try {
                if (jwtUtil.isTokenValid(token)) {
                    String document = jwtUtil.getDocumentFromToken(token);
                    var userDetails = userDetailService.loadUserByUsername(document);

                    var auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    logger.info("Authentication successful for user: " + document);
                }
            } catch (Exception e) {
                logger.error("Error processing token: " + e.getMessage());
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}