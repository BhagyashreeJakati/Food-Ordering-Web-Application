package com.mahel.FoodOrderingService.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartItemDTO {

    private Long foodId;
    private int quantity;
    private List<String> ingredients;
    private Long cartItemId;
}
