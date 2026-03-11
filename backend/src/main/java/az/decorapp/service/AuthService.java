package az.decorapp.service;

import az.decorapp.dto.AuthResponse;
import az.decorapp.dto.LoginRequest;
import az.decorapp.dto.RegisterRequest;
import az.decorapp.dto.UserDTO;
import az.decorapp.entity.User;
import az.decorapp.enums.Role;
import az.decorapp.exception.BadRequestException;
import az.decorapp.exception.UnauthorizedException;
import az.decorapp.mapper.UserMapper;
import az.decorapp.repository.UserRepository;
import az.decorapp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Bu istifadəçi adı artıq istifadə olunur");
        }

        // Check if phone exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Bu telefon nömrəsi artıq qeydiyyatdan keçib");
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setCompanyName(request.getCompanyName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.DECORATOR);
        user.setLevel(1);
        user.setTotalOrders(0);
        user.setTotalSales(BigDecimal.ZERO);
        user.setCurrentDebt(BigDecimal.ZERO);
        user.setDebtLimit(new BigDecimal("1000"));
        user.setActive(true);

        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toDTO(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("İstifadəçi adı və ya şifrə yanlışdır"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Hesabınız deaktiv edilib");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("İstifadəçi adı və ya şifrə yanlışdır");
        }

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userMapper.toDTO(user))
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Yararsız token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("İstifadəçi tapılmadı"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .user(userMapper.toDTO(user))
                .build();
    }
}
