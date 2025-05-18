package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.model.User;
import com.propabanda.finance_tracker.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDetails loadUserByUsername(String documentNumber) throws UsernameNotFoundException {
        User user = userRepository.findByDocumentNumber(documentNumber)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getDocumentNumber())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
}
