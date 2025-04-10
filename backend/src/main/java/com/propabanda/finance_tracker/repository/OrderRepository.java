package com.propabanda.finance_tracker.repository;

import com.propabanda.finance_tracker.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
