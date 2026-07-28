package com.shopsphere.service.impl;

import com.shopsphere.dto.request.LoginRequest;
import com.shopsphere.dto.request.RefreshTokenRequest;
import com.shopsphere.dto.request.RegisterRequest;
import com.shopsphere.dto.response.AuthResponse;
import com.shopsphere.entity.RefreshToken;
import com.shopsphere.entity.Role;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.DuplicateResourceException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.UserMapper;
import com.shopsphere.repository.RefreshTokenRepository;
import com.shopsphere.repository.RoleRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.security.CustomUserDetails;
import com.shopsphere.security.JwtService;
import com.shopsphere.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("Default role ROLE_CUSTOMER not seeded"));

        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .emailVerified(false)
                .enabled(true)
                .roles(roles)
                .build();

        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (storedToken.isRevoked() || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Refresh token expired or revoked. Please log in again.");
        }

        User user = storedToken.getUser();
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String newAccessToken = jwtService.generateAccessToken(userDetails);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(storedToken.getToken())
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    private AuthResponse buildAuthResponse(User user) {
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String accessToken = jwtService.generateAccessToken(userDetails);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }
}
