package com.propabanda.finance_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_item")
@Getter
@Setter
public class OrderItem {

    @EmbeddedId
    private OrderItemPK id = new OrderItemPK();

    @ManyToOne(optional = false)
    @MapsId("orderId")
    private Order order;

    @ManyToOne(optional = false)
    @MapsId("itemId")
    private Item item;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "price_snapshot", nullable = false)
    private BigDecimal priceSnapshot;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;
}
