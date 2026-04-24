package com.example.Blood.controller;

import com.example.Blood.dto.request.BloodRequestDTO;
import com.example.Blood.entity.BloodRequest;
import com.example.Blood.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/request")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping("/create")
    public ResponseEntity<BloodRequest> create(@RequestBody BloodRequestDTO dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<BloodRequest> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestStatus(id));
    }
}
