package az.decorapp.dto;

import az.decorapp.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserDTO {
    private UUID id;
    private String fullName;
    private String username;
    private String phone;
    private String email;
    private Role role;
    private Integer level;
    private Integer totalOrders;
    private BigDecimal totalSales;
    private BigDecimal currentDebt;
    private BigDecimal debtLimit;
    private String companyName;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
