package com.mahel.FoodOrderingService.controller;

import com.mahel.FoodOrderingService.dto.response.PaymentResponse;
import com.mahel.FoodOrderingService.model.Order;
import com.mahel.FoodOrderingService.model.User;
import com.mahel.FoodOrderingService.service.OrderService;
import com.mahel.FoodOrderingService.service.PaymentService;
import com.mahel.FoodOrderingService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/payments")
public class PaymentController {

    @Autowired private PaymentService paymentService;
    @Autowired private OrderService orderService;
    @Autowired private UserService userService;

    @PostMapping("/{orderId}")
    public ResponseEntity<PaymentResponse> createPaymentLink(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        userService.userByToken(jwt); // verify auth
        Order order = orderService.findOrderById(orderId);
        PaymentResponse response = paymentService.createPaymentLink(order);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
