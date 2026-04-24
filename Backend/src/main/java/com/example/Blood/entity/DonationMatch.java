package com.example.Blood.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private BloodRequest request;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;

    @Builder.Default
    private boolean notified = false;

    @Builder.Default
    private boolean donorResponded = false;

    @Builder.Default
    private LocalDateTime matchedAt = LocalDateTime.now();
}
