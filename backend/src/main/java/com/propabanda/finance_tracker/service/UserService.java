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

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(this::toUserResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserResponseDTO> findById(Long id) {
        return userRepository.findById(id).map(this::toUserResponseDTO);
    }

    public Optional<User> findModelByDocumentNumber(String documentNumber) {
        return userRepository.findByDocumentNumber(documentNumber);
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
        user.setDocumentNumber(userRequestDTO.getDocumentNumber());
        user.setPassword(bCryptPasswordEncoder.encode(userRequestDTO.getPassword()));
        user.setRole(userRequestDTO.getRole() != null ? userRequestDTO.getRole() : "admin");
        return user;
    }

    private UserResponseDTO toUserResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setDocumentNumber(user.getDocumentNumber());
        userResponseDTO.setRole(user.getRole());
        return userResponseDTO;
    }
}
