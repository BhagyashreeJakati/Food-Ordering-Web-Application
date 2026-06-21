package com.mahel.FoodOrderingService.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mahel.FoodOrderingService.enums.UserRole;
import lombok.Data;

@Data
public class JWTResponseDTO {

    private String jwt;
    private String email;
    private String userName;

    // Serialize as enum name e.g. "ROLE_RESTAURANT_OWNER" not the object
    @JsonProperty("role")
    private String role;

    // Accept UserRole enum but store as string for clean JSON
    public void setRole(UserRole role) {
        this.role = role != null ? role.name() : null;
    }

    public String getRole() {
        return role;
    }
}
