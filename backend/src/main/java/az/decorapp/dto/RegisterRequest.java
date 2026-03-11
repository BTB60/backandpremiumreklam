package az.decorapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Ad və soyad tələb olunur")
    private String fullName;
    
    @NotBlank(message = "İstifadəçi adı tələb olunur")
    @Size(min = 3, max = 50, message = "İstifadəçi adı 3-50 simvol arası olmalıdır")
    private String username;
    
    @NotBlank(message = "Telefon nömrəsi tələb olunur")
    private String phone;
    
    private String email;
    
    private String companyName;
    
    @NotBlank(message = "Şifrə tələb olunur")
    @Size(min = 6, message = "Şifrə ən az 6 simvol olmalıdır")
    private String password;
}
