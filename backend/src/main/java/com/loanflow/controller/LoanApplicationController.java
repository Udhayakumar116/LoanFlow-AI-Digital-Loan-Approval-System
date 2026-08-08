package com.loanflow.controller;

import com.loanflow.entity.LoanApplication;
import com.loanflow.repository.LoanApplicationRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/loans")
@CrossOrigin(origins = "*")
public class LoanApplicationController {

    private final LoanApplicationRepository repository;

    public LoanApplicationController(LoanApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<LoanApplication> getAllLoans() {
        return repository.findAll();
    }

    @PostMapping("/apply")
    public LoanApplication applyLoan(@RequestBody LoanApplication application) {
        application.setStatus("SUBMITTED");
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        application.setVersion(0);
        if (application.getApplicationNumber() == null) {
            application.setApplicationNumber("LN-" + System.currentTimeMillis());
        }
        return repository.save(application);
    }
}