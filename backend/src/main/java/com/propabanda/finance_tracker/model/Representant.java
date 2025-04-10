package com.propabanda.finance_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "representant")
@Getter
@Setter
public class Representant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column(name = "email", nullable = false)
    private String email;

    @NotBlank
    @Size(min = 10, max = 11)
    @Column(name = "phone", nullable = false)
    private String phone;
}
