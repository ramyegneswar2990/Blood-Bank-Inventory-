package com.example.Blood.service;

import com.example.Blood.dto.request.BloodRequestDTO;
import com.example.Blood.entity.*;
import com.example.Blood.enums.RequestStatus;
import com.example.Blood.repository.BloodRequestRepository;
import com.example.Blood.repository.DonationMatchRepository;
import com.example.Blood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final BloodRequestRepository requestRepository;
    private final DonationMatchRepository matchRepository;
    private final MatchingEngineService matchingEngine;
    private final UserRepository userRepository;

    @Transactional
    public BloodRequest createRequest(BloodRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User receiver = userRepository.findByEmail(email).orElseThrow();

        BloodRequest request = BloodRequest.builder()
                .receiver(receiver)
                .bloodGroup(dto.getBloodGroup())
                .urgencyLevel(dto.getUrgencyLevel())
                .location(dto.getLocation())
                .requiredUnits(dto.getRequiredUnits())
                .status(RequestStatus.PENDING)
                .build();

        BloodRequest savedRequest = requestRepository.save(request);

        // Auto-match donors
        List<Donor> matchedDonors = matchingEngine.findMatchingDonors(dto.getBloodGroup(), null, null, 5);
        
        for (Donor donor : matchedDonors) {
            DonationMatch match = DonationMatch.builder()
                    .request(savedRequest)
                    .donor(donor)
                    .notified(true)
                    .build();
            matchRepository.save(match);
            
            // Mock Notification
            System.out.println("NOTIFICATION SENT to " + donor.getUser().getEmail() + 
                               ": Emergency " + dto.getBloodGroup() + " request in " + dto.getLocation());
        }

        return savedRequest;
    }

    public BloodRequest getRequestStatus(Long id) {
        return requestRepository.findById(id).orElseThrow();
    }
}
