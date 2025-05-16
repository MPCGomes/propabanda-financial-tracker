package com.propabanda.finance_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import static jakarta.persistence.CascadeType.ALL;

@Entity
@Table(name = "app_order")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @NotNull
    @Column(name = "contract_start_date", nullable = false)
    private LocalDate contractStartDate;

    @NotNull
    @Column(name = "contract_end_date", nullable = false)
    private LocalDate contractEndDate;

    @NotNull
    @Min(1)
    @Max(31)
    @Column(name = "installment_day", nullable = false)
    private Integer installmentDay;

    @NotNull
    @Min(1)
    @Column(name = "installment_count", nullable = false)
    private Integer installmentCount;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    @Column(name = "discount", nullable = false)
    private BigDecimal discount;

    @NotNull
    @Column(name = "emission_date", nullable = false)
    private LocalDate emissionDate;

    @NotNull
    @Min(0)
    @Column(name = "paid_installments_count", nullable = false)
    private Integer paidInstallmentsCount;

    @Column(name = "contract_file_path")
    private String contractFilePath;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> items;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
