package com.mahel.FoodOrderingService.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Frontend sends "streetAddress" — alias maps it
    @JsonAlias("streetAddress")
    private String street;

    private String city;
    private String state;

    // Frontend sends "pincode" — alias maps it; also expose as pincode in responses
    @JsonAlias("pincode")
    private String postalCode;

    private String country;

    // Getter alias so frontend gets "pincode" back in responses too
    @Transient
    public String getPincode() { return postalCode; }

    private String landmark;

    @OneToOne(mappedBy = "address")
    @JsonIgnore
    private Restaurant restaurant;
}
