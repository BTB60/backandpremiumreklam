package az.decorapp.entity;

import az.decorapp.enums.Role;
import az.decorapp.enums.SubscriptionPlan;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "phone", unique = true, nullable = false)
    private String phone;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private Role role = Role.DECORATOR;

    @Column(name = "is_phone_verified")
    @Builder.Default
    private Boolean isPhoneVerified = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "level")
    @Builder.Default
    private Integer level = 1;

    @Column(name = "total_orders")
    @Builder.Default
    private Integer totalOrders = 0;

    @Column(name = "total_sales", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalSales = BigDecimal.ZERO;

    @Column(name = "debt_limit", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal debtLimit = new BigDecimal("1000");

    @Column(name = "current_debt", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentDebt = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan")
    @Builder.Default
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.BASIC;

    @Column(name = "referral_code", unique = true)
    private String referralCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referred_by")
    private User referredBy;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal commissionRate = new BigDecimal("15.00");

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
