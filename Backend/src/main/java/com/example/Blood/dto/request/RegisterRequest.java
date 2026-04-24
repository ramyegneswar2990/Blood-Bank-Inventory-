package com.example.Blood.dto.request;

import com.example.Blood.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String location;

    // Donor specific
    private String bloodGroup;
    private LocalDate lastDonationDate;
    private Double latitude;
    private Double longitude;
}
