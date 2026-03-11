package az.decorapp.entity;

import az.decorapp.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "payment_status", nullable = false)
    @Builder.Default
    private String paymentStatus = "pending";

    @Column(name = "payment_method", nullable = false)
    @Builder.Default
    private String paymentMethod = "cash";

    @Column(name = "subtotal", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "discount_total", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discountTotal = BigDecimal.ZERO;

    @Column(name = "final_total", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal finalTotal = BigDecimal.ZERO;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "estimated_ready_at")
    private LocalDateTime estimatedReadyAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
