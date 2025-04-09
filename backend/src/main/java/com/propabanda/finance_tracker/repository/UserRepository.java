package com.propabanda.finance_tracker.repository;


import com.propabanda.finance_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByDocumentNumber(String documentNumber);
}
