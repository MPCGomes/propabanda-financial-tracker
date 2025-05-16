package com.propabanda.finance_tracker.model;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class OrderItemPK implements Serializable {
    private Long orderId;
    private Long itemId;
}
