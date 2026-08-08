package com.loanflow.controller;

import com.loanflow.entity.LoanProduct;
import com.loanflow.repository.LoanProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class LoanProductController {

    private final LoanProductRepository repository;

    public LoanProductController(LoanProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<LoanProduct> getAllProducts() {
        return repository.findAll();
    }
}