package com.example.Blood.service;

import com.example.Blood.entity.Donor;
import com.example.Blood.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingEngineService {

    private final DonorRepository donorRepository;

    public List<Donor> findMatchingDonors(String bloodGroup, Double requestLat, Double requestLon, int limit) {
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);

        List<Donor> availableDonors = donorRepository.findAll().stream()
                .filter(d -> d.getBloodGroup().equalsIgnoreCase(bloodGroup))
                .filter(Donor::isAvailabilityStatus)
                .filter(d -> d.getLastDonationDate() == null || d.getLastDonationDate().isBefore(threeMonthsAgo))
                .collect(Collectors.toList());

        // Sort by distance if coordinates provided
        if (requestLat != null && requestLon != null) {
            availableDonors.sort(Comparator.comparingDouble(d -> 
                calculateDistance(requestLat, requestLon, d.getLatitude(), d.getLongitude())));
        }

        return availableDonors.stream().limit(limit).collect(Collectors.toList());
    }

    // Simple Euclidean distance for mock logic, could be Haversine
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Double.MAX_VALUE;
        return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
    }
}
