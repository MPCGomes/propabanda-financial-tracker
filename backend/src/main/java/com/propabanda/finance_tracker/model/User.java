package com.propabanda.finance_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "app_user")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Size(min = 11, max = 11)
    @Column(name = "document_number", unique = true, nullable = false)
    private String documentNumber;

    @NotBlank
    @Column(name = "password", nullable = false)
    private String password;

    @NotBlank
    @Column(name = "role", nullable = false)
    private String role;

    @PrePersist @PreUpdate
    private void sanitize() {
        this.documentNumber = documentNumber.replaceAll("\\D", "");
    }
}
