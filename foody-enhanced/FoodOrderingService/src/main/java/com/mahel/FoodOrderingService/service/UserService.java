package com.mahel.FoodOrderingService.service;

import com.mahel.FoodOrderingService.dto.UserDTO;
import com.mahel.FoodOrderingService.model.User;

public interface UserService {
    User registerUser(UserDTO userDTO) throws Exception;
    User userByToken(String token) throws Exception;
    User userByEmail(String email) throws Exception;
    void forgotPassword(String email) throws Exception;
    void resetPassword(String token, String newPassword) throws Exception;
    void changePassword(String token, String oldPassword, String newPassword) throws Exception;
}
