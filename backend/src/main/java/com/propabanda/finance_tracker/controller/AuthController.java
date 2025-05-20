package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.Security.JWTUtil;
import com.propabanda.finance_tracker.dto.request.AuthRequestDTO;
import com.propabanda.finance_tracker.dto.response.AuthResponseDTO;
import com.propabanda.finance_tracker.model.User;
import com.propabanda.finance_tracker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public AuthController(UserRepository userRepository, JWTUtil jwtUtil, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid AuthRequestDTO dto) {
        User user = userRepository.findByDocumentNumber(dto.getDocumentNumber())
                .orElseThrow(() -> new UsernameNotFoundException("Credenciais inválidas"));
        if (!bCryptPasswordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponseDTO("Credenciais inválidas"));
        }
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }
}
