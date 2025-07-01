package com.propabanda.finance_tracker.repository;

import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.ClientStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByDocumentNumber(String documentNumber);

    boolean existsByDocumentNumber(String documentNumber);

    List<Client> findAllByStatus(ClientStatus status);

    List<Client> findAllByNameContainingIgnoreCaseAndStatus(String name, ClientStatus status);
}
