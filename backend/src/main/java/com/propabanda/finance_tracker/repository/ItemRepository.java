package com.propabanda.finance_tracker.repository;

import com.propabanda.finance_tracker.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByName(String name);

    Optional<Item> findByNameIgnoreCase(String name);
}
