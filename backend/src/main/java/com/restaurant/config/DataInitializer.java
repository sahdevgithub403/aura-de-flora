package com.restaurant.config;

import com.restaurant.model.User;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            User admin = userRepository.findByUsername("admin").orElse(null);

            if (admin == null) {
                admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@restaurant.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("Admin User");
                System.out.println("Creating new admin user...");
            } else {
                System.out.println("Updating existing admin user privileges...");
            }

            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin user verified: admin / admin123");
        };
    }
}
