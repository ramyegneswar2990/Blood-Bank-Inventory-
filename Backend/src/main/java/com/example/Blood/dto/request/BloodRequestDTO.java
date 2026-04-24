package com.example.Blood.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestDTO {
    private String bloodGroup;
    private String urgencyLevel;
    private String location;
    private Integer requiredUnits;
}
