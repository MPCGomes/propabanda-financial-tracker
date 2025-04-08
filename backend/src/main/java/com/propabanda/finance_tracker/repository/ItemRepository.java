package com.propabanda.finance_tracker.repository;

import com.propabanda.finance_tracker.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByName(String name);
}
