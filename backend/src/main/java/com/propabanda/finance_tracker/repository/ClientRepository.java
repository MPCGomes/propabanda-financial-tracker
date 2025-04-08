package com.propabanda.finance_tracker.repository;

import com.propabanda.finance_tracker.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByDocumentNumber(String documentNumber);

    boolean existsByDocumentNumber(String documentNumber);
}
