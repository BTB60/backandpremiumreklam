package az.decorapp.mapper;

import az.decorapp.dto.UserDTO;
import az.decorapp.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserDTO toDTO(User user) {
        if (user == null) return null;
        
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole())
                .level(user.getLevel())
                .totalOrders(user.getTotalOrders())
                .totalSales(user.getTotalSales())
                .currentDebt(user.getCurrentDebt())
                .debtLimit(user.getDebtLimit())
                .companyName(user.getCompanyName())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
