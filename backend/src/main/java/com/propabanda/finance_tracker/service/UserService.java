package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.request.UserRequestDTO;
import com.propabanda.finance_tracker.dto.response.UserResponseDTO;
import com.propabanda.finance_tracker.model.User;
import com.propabanda.finance_tracker.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository         userRepository;
    private final BCryptPasswordEncoder  passwordEncoder;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserResponseDTO> findById(Long id) {
        return userRepository.findById(id).map(this::toUserResponseDTO);
    }

    public Optional<User> findModelByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserResponseDTO save(UserRequestDTO userRequestDTO) {
        User user = toUserModel(userRequestDTO);
        user = userRepository.save(user);
        return toUserResponseDTO(user);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    private User toUserModel(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setUsername(userRequestDTO.getUsername().trim());
        user.setDocumentNumber(userRequestDTO.getDocumentNumber());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        user.setRole(userRequestDTO.getRole());
        return user;
    }

    private UserResponseDTO toUserResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setUsername(user.getUsername());
        userResponseDTO.setDocumentNumber(user.getDocumentNumber());
        userResponseDTO.setRole(user.getRole());
        return userResponseDTO;
    }
}
