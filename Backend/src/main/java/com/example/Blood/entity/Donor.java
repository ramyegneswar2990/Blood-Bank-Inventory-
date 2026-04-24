package com.example.Blood.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "donors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String bloodGroup;

    @Builder.Default
    private boolean availabilityStatus = true;

    private LocalDate lastDonationDate;

    // Optional: Coordinates for distance logic
    private Double latitude;
    private Double longitude;
}
