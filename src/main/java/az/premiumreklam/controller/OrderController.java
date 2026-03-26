package az.premiumreklam.controller;

import az.premiumreklam.dto.order.OrderRequest;
import az.premiumreklam.dto.order.OrderResponse;
import az.premiumreklam.enums.OrderStatus;
import az.premiumreklam.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse create(@RequestBody OrderRequest request, Authentication authentication) {
        return orderService.createOrderResponse(request, authentication.getName());
    }

    @GetMapping
    public List<OrderResponse> getAll(Authentication authentication) {
        return orderService.getAllOrdersResponse();
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        return orderService.getOrdersByUsernameResponse(authentication.getName());
    }

    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable UUID id) {
        return orderService.getOrderByIdResponse(id);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponse updateStatus(@PathVariable UUID id, @RequestParam String status) {
        OrderStatus orderStatus = OrderStatus.fromValue(status);
        return orderService.updateOrderStatusResponse(id, orderStatus);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
}
