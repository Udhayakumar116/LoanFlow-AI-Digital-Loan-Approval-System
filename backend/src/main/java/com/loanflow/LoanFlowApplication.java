package com.loanflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * LoanFlow - Enterprise Digital Loan Approval System Main Application Class
 * 
 * Architecture: Clean Layered Architecture
 * Tech Stack: Java 21, Spring Boot 3.3.x, Spring Security, Spring Data JPA, MySQL 8
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class LoanFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoanFlowApplication.class, args);
    }
}
