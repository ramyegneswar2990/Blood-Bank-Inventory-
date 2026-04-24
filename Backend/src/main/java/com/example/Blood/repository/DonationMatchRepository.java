package com.example.Blood.repository;

import com.example.Blood.entity.DonationMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationMatchRepository extends JpaRepository<DonationMatch, Long> {
    List<DonationMatch> findByRequestId(Long requestId);
}
