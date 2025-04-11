package com.propabanda.finance_tracker.Security;

import com.propabanda.finance_tracker.service.UserDetailServiceImpl;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtFilter extends GenericFilter {

    private final JWTUtil jwtUtil;
    private final UserDetailServiceImpl userDetailService;

    public JwtFilter(JWTUtil jwtUtil, UserDetailServiceImpl userDetailService) {
        this.jwtUtil = jwtUtil;
        this.userDetailService = userDetailService;
    }

    @Override
    public void doFilter (ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        String authHeader = ((HttpServletRequest) servletRequest).getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");

            if (jwtUtil.isTokenValid(token)) {
                String document = jwtUtil.getDocumentFromToken(token);
                var userDetails = userDetailService.loadUserByUsername(document);

                var auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
