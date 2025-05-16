package com.propabanda.finance_tracker.model;

import com.propabanda.finance_tracker.util.Sanitizer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank
    @Size(max = 60)
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Pattern(regexp = "\\d{11}")
    @Column(nullable = false, unique = true)
    private String documentNumber;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Column(nullable = false)
    private String role;

    @PrePersist
    @PreUpdate
    private void sanitize() {
        this.documentNumber = Sanitizer.digitsOnly(documentNumber);
    }
}
