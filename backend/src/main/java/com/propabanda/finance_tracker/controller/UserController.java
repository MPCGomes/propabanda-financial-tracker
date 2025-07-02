package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.Security.JWTUtil;
import com.propabanda.finance_tracker.dto.request.ChangePasswordRequestDTO;
import com.propabanda.finance_tracker.dto.request.UserRequestDTO;
import com.propabanda.finance_tracker.dto.response.UserResponseDTO;
import com.propabanda.finance_tracker.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    public UserController(UserService userService, JWTUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody @Valid UserRequestDTO userRequestDTO) {
        if (userService.findModelByDocumentNumber(userRequestDTO.getDocumentNumber()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userService.save(userRequestDTO));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody @Valid ChangePasswordRequestDTO dto,
            BindingResult bindingResult,
            HttpServletRequest request) {

        // extract token from header
        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Não autenticado"));
        }
        String token = auth.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido"));
        }

        // your existing validation & change logic, but using userId from token
        if (bindingResult.hasErrors()) {
            Map<String, String> errs = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
            return ResponseEntity.badRequest().body(Map.of("errors", errs));
        }
        if (dto.getCurrentPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Senha atual é obrigatória"));
        }
        if (dto.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nova senha é obrigatória"));
        }

        userService.changePassword(userId, dto);
        return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}