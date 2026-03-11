package az.decorapp.config;

import az.decorapp.entity.User;
import az.decorapp.enums.Role;
import az.decorapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .fullName("System Admin")
                        .username("admin")
                        .phone("+994501234567")
                        .email("admin@decorapp.az")
                        .passwordHash(passwordEncoder.encode("nasir147286"))
                        .role(Role.ADMIN)
                        .isActive(true)
                        .isPhoneVerified(true)
                        .level(1)
                        .totalOrders(0)
                        .totalSales(BigDecimal.ZERO)
                        .currentDebt(BigDecimal.ZERO)
                        .debtLimit(new BigDecimal("10000"))
                        .build();
                
                userRepository.save(admin);
                System.out.println("Admin user created successfully!");
            }
        };
    }
}
