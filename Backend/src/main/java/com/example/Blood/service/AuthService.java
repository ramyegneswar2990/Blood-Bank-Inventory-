package com.example.Blood.service;

import com.example.Blood.config.JwtUtils;
import com.example.Blood.dto.request.LoginRequest;
import com.example.Blood.dto.request.RegisterRequest;
import com.example.Blood.dto.response.AuthResponse;
import com.example.Blood.entity.Donor;
import com.example.Blood.enums.Role;
import com.example.Blood.entity.User;
import com.example.Blood.repository.DonorRepository;
import com.example.Blood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .location(request.getLocation())
                .build();
        
        userRepository.save(user);

        if (request.getRole() == Role.DONOR) {
            var donor = Donor.builder()
                    .user(user)
                    .bloodGroup(request.getBloodGroup())
                    .lastDonationDate(request.getLastDonationDate())
                    .availabilityStatus(true)
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .build();
            donorRepository.save(donor);
        }

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var jwtToken = jwtUtils.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var jwtToken = jwtUtils.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }
}
