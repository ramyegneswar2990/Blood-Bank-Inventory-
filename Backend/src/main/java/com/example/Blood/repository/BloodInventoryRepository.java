package com.example.Blood.repository;

import com.example.Blood.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    List<BloodInventory> findByBloodGroup(String bloodGroup);
}
