package com.example.Blood.controller;

import com.example.Blood.entity.BloodInventory;
import com.example.Blood.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/check")
    public ResponseEntity<List<BloodInventory>> checkAvailability(@RequestParam String group) {
        return ResponseEntity.ok(inventoryService.checkAvailability(group));
    }

    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodInventory> addInventory(@RequestBody BloodInventory inventory) {
        return ResponseEntity.ok(inventoryService.addOrUpdateInventory(inventory));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BloodInventory>> getAll() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}
