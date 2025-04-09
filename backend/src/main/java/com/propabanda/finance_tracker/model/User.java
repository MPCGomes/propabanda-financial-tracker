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

    @NotBlank
    @Size(min = 11, max = 11)
    @Column(name = "document_number", unique = true)
    private String documentNumber;

    @NotBlank
    private String password;

    @NotBlank
    private String role;
}
