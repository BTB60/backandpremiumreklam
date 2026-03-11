package az.decorapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false)
    private String productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "width", precision = 10, scale = 2, nullable = false)
    private BigDecimal width;

    @Column(name = "height", precision = 10, scale = 2, nullable = false)
    private BigDecimal height;

    @Column(name = "area", precision = 10, scale = 2, nullable = false)
    private BigDecimal area;

    @Column(name = "quantity", nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "note")
    private String note;
}
