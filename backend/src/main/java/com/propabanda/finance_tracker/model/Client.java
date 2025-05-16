package com.propabanda.finance_tracker.model;

import com.propabanda.finance_tracker.util.Sanitizer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "client")
@Getter
@Setter
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank
    @Size(min = 14, max = 14)
    @Column(name = "document_number", unique = true, nullable = false)
    private String documentNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "representant_id", referencedColumnName = "id", nullable = false, unique = true)
    private Representative representative;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id", nullable = false, unique = true)
    private Address address;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    private void sanitize() {
        this.documentNumber = Sanitizer.digitsOnly(documentNumber);
    }
}
