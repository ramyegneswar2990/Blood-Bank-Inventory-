package com.example.Blood.service;

import com.example.Blood.entity.BloodInventory;
import com.example.Blood.repository.BloodInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final BloodInventoryRepository repository;

    public BloodInventory addOrUpdateInventory(BloodInventory inventory) {
        return repository.save(inventory);
    }

    public List<BloodInventory> checkAvailability(String bloodGroup) {
        return repository.findByBloodGroup(bloodGroup);
    }

    public List<BloodInventory> getAllInventory() {
        return repository.findAll();
    }

    public void deleteInventory(Long id) {
        repository.deleteById(id);
    }
}
