package com.mahel.FoodOrderingService.controller;

import com.mahel.FoodOrderingService.dto.response.ResponseDTO;
import com.mahel.FoodOrderingService.model.Order;
import com.mahel.FoodOrderingService.service.OrderService;
import com.mahel.FoodOrderingService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/v1/admin/orders")
public class AdminOrderController {

    @Autowired private OrderService orderService;
    @Autowired private UserService userService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ResponseDTO<List<Order>>> getRestaurantOrders(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String orderStatus,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.userByToken(jwt);
        ResponseDTO<List<Order>> response = new ResponseDTO<>();
        List<Order> orders = orderService.getRestaurantOrders(restaurantId, orderStatus);
        response.setPayload(orders);
        response.setMessage("Success");
        response.setHttpStatus(HttpStatus.OK);
        response.setCode("200");
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PutMapping("/{orderId}/{orderStatus}")
    public ResponseEntity<ResponseDTO<Order>> updateOrderStatus(
            @PathVariable Long orderId,
            @PathVariable String orderStatus,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.userByToken(jwt);
        ResponseDTO<Order> response = new ResponseDTO<>();
        Order order = orderService.updateOrder(orderId, orderStatus.toUpperCase());
        response.setPayload(order);
        response.setMessage("Status updated to " + orderStatus);
        response.setHttpStatus(HttpStatus.OK);
        response.setCode("200");
        return new ResponseEntity<>(response, response.getHttpStatus());
    }
}
