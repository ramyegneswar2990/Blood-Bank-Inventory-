package com.example.Blood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blood_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodGroup;

    private Integer units;

    private String hospitalName;

    private String location;
}
