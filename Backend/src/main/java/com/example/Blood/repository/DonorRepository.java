package com.example.Blood.repository;

import com.example.Blood.entity.Donor;
import com.example.Blood.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByUser(User user);
    List<Donor> findByBloodGroupAndAvailabilityStatus(String bloodGroup, boolean status);
}
