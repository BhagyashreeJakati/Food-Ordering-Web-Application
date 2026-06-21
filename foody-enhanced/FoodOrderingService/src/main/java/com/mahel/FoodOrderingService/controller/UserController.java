package com.mahel.FoodOrderingService.controller;

import com.mahel.FoodOrderingService.config.JwtProvider;
import com.mahel.FoodOrderingService.dto.UserDTO;
import com.mahel.FoodOrderingService.dto.JWTResponseDTO;
import com.mahel.FoodOrderingService.dto.response.ResponseDTO;
import com.mahel.FoodOrderingService.enums.UserRole;
import com.mahel.FoodOrderingService.model.User;
import com.mahel.FoodOrderingService.service.EmailService;
import com.mahel.FoodOrderingService.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private JwtProvider jwtProvider;
    @Autowired private ModelMapper modelMapper;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO<JWTResponseDTO>> registerUser(@RequestBody UserDTO userDTO) throws Exception {
        if (userDTO.getRole() == null) userDTO.setRole(UserRole.ROLE_CUSTOMER);
        if (userDTO.getRole() != UserRole.ROLE_CUSTOMER && userDTO.getRole() != UserRole.ROLE_RESTAURANT_OWNER) {
            userDTO.setRole(UserRole.ROLE_CUSTOMER);
        }
        String rawPassword = userDTO.getPassword();
        userService.registerUser(userDTO);

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(userDTO.getEmail(), rawPassword)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);
        User user = userService.userByEmail(userDTO.getEmail());

        ResponseDTO<JWTResponseDTO> response = new ResponseDTO<>();
        JWTResponseDTO dto = new JWTResponseDTO();
        dto.setJwt(jwt); dto.setEmail(user.getEmail());
        dto.setUserName(user.getFullName()); dto.setRole(user.getRole());
        response.setPayload(dto);
        response.setMessage("Registered Successfully");
        response.setHttpStatus(HttpStatus.CREATED);
        response.setCode("201");
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<JWTResponseDTO>> loginUser(@RequestBody UserDTO userDTO) throws Exception {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);
        User user = userService.userByEmail(userDTO.getEmail());

        // Send login security alert email (async — won't block login)
        new Thread(() -> emailService.sendLoginAlertEmail(user.getEmail(), user.getFullName())).start();

        ResponseDTO<JWTResponseDTO> response = new ResponseDTO<>();
        JWTResponseDTO dto = new JWTResponseDTO();
        dto.setJwt(jwt); dto.setEmail(user.getEmail());
        dto.setUserName(user.getFullName()); dto.setRole(user.getRole());
        response.setPayload(dto);
        response.setMessage("Login Successful");
        response.setHttpStatus(HttpStatus.OK);
        response.setCode("200");
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @GetMapping("/profile")
    public ResponseEntity<ResponseDTO<UserDTO>> userByToken(@RequestHeader("Authorization") String token) throws Exception {
        ResponseDTO<UserDTO> response = new ResponseDTO<>();
        UserDTO userDTO = modelMapper.map(userService.userByToken(token), UserDTO.class);
        response.setPayload(userDTO);
        response.setMessage("Success");
        response.setCode("200");
        response.setHttpStatus(HttpStatus.OK);
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDTO<String>> forgotPassword(@RequestBody Map<String, String> body) {
        ResponseDTO<String> response = new ResponseDTO<>();
        try {
            userService.forgotPassword(body.get("email"));
            response.setMessage("If this email is registered, a reset link has been sent.");
            response.setPayload("OK");
            response.setHttpStatus(HttpStatus.OK);
            response.setCode("200");
        } catch (Exception e) {
            response.setMessage("Something went wrong. Please try again.");
            response.setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setCode("500");
        }
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDTO<String>> resetPassword(@RequestBody Map<String, String> body) {
        ResponseDTO<String> response = new ResponseDTO<>();
        try {
            userService.resetPassword(body.get("token"), body.get("newPassword"));
            response.setMessage("Password reset successfully. Please login.");
            response.setPayload("OK");
            response.setHttpStatus(HttpStatus.OK);
            response.setCode("200");
        } catch (Exception e) {
            response.setMessage(e.getMessage());
            response.setHttpStatus(HttpStatus.BAD_REQUEST);
            response.setCode("400");
        }
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PostMapping("/change-password")
    public ResponseEntity<ResponseDTO<String>> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> body) {
        ResponseDTO<String> response = new ResponseDTO<>();
        try {
            userService.changePassword(token, body.get("oldPassword"), body.get("newPassword"));
            response.setMessage("Password changed successfully.");
            response.setPayload("OK");
            response.setHttpStatus(HttpStatus.OK);
            response.setCode("200");
        } catch (Exception e) {
            response.setMessage(e.getMessage());
            response.setHttpStatus(HttpStatus.BAD_REQUEST);
            response.setCode("400");
        }
        return new ResponseEntity<>(response, response.getHttpStatus());
    }
}
