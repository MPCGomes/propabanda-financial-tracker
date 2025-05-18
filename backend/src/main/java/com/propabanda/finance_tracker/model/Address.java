package com.propabanda.finance_tracker.model;

import com.propabanda.finance_tracker.util.Sanitizer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 8, max = 8)
    @Column(name = "zip_code", nullable = false)
    @Pattern(regexp = "\\d{8}")
    private String zipCode;

    @NotBlank
    @Size(min = 2, max = 2)
    @Column(name = "state", nullable = false)
    @Pattern(regexp = "[A-Z]{2}")
    private String state;

    @NotBlank
    @Size(max = 100)
    @Column(name = "city", nullable = false)
    private String city;

    @NotBlank
    @Size(max = 100)
    @Column(name = "neighbourhood", nullable = false)
    private String neighbourhood;

    @NotBlank
    @Size(max = 100)
    @Column(name = "street", nullable = false)
    private String street;

    @NotBlank
    @Size(max = 5)
    @Column(name = "number", nullable = false)
    private String number;

    @Size(max = 50)
    @Column(name = "complement")
    private String complement;

    @Size(max = 100)
    @Column(name = "reference")
    private String reference;

    @PrePersist
    @PreUpdate
    private void sanitize() {
        this.zipCode = Sanitizer.digitsOnly(zipCode);
        this.number = Sanitizer.digitsOnly(number);
    }
}
