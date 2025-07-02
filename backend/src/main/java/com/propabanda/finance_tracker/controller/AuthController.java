package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.Security.JWTUtil;
import com.propabanda.finance_tracker.dto.request.AuthRequestDTO;
import com.propabanda.finance_tracker.dto.response.AuthResponseDTO;
import com.propabanda.finance_tracker.model.User;
import com.propabanda.finance_tracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "https://admpropabanda.com.br", "https://www.admpropabanda.com.br", "http://localhost:*" })
public class AuthController {

    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(UserRepository userRepository, JWTUtil jwtUtil, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/auth")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid AuthRequestDTO dto) {
        logger.info("Received login request for documentNumber: {}", dto.getDocumentNumber());

        try {
            User user = userRepository.findByDocumentNumber(dto.getDocumentNumber())
                    .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));

            logger.info("User found: {}", user.getDocumentNumber());

            if (!bCryptPasswordEncoder.matches(dto.getPassword(), user.getPassword())) {
                logger.error("Invalid credentials for user: {}", dto.getDocumentNumber());
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponseDTO("Credenciais inválidas"));
            }

            String token = jwtUtil.generateToken(user);
            logger.info("Token generated successfully for user: {}", user.getDocumentNumber());

            return ResponseEntity.ok(new AuthResponseDTO(token));

        } catch (UsernameNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO("Credenciais inválidas"));
        } catch (Exception e) {
            logger.error("Unexpected error during authentication: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponseDTO("Erro interno do servidor"));
        }
    }

    @GetMapping("/auth/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("Auth endpoint is working");
    }
}