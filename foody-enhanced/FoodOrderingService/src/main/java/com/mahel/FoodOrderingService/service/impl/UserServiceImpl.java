package com.mahel.FoodOrderingService.service.impl;

import com.mahel.FoodOrderingService.config.JwtProvider;
import com.mahel.FoodOrderingService.repository.CartRepository;
import com.mahel.FoodOrderingService.dto.UserDTO;
import com.mahel.FoodOrderingService.model.Cart;
import com.mahel.FoodOrderingService.model.User;
import com.mahel.FoodOrderingService.repository.UserRepository;
import com.mahel.FoodOrderingService.service.EmailService;
import com.mahel.FoodOrderingService.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private CartRepository cartRepository;
    @Autowired private ModelMapper modelMapper;
    @Autowired private JwtProvider jwtProvider;
    @Autowired private EmailService emailService;

    @Override
    public User registerUser(UserDTO userDTO) throws Exception {
        User isUser = userRepository.findByEmail(userDTO.getEmail());
        if (isUser != null) throw new Exception("Email Already Registered");

        User newUser = new User();
        newUser.setEmail(userDTO.getEmail());
        newUser.setFullName(userDTO.getFullName());
        newUser.setRole(userDTO.getRole());
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User savedUser = userRepository.save(newUser);

        Cart cart = new Cart();
        cart.setCustomer(savedUser);
        cartRepository.save(cart);

        return savedUser;
    }

    @Override
    public User userByToken(String token) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(token);
        return userRepository.findByEmail(email);
    }

    @Override
    public User userByEmail(String email) throws Exception {
        return userRepository.findByEmail(email);
    }

    @Override
    public void forgotPassword(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Don't reveal whether email exists — security best practice
            return;
        }
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        emailService.sendPasswordResetEmail(email, token, user.getFullName());
    }

    @Override
    public void resetPassword(String token, String newPassword) throws Exception {
        User user = userRepository.findByResetToken(token);
        if (user == null) throw new Exception("Invalid or expired reset link.");
        if (user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            throw new Exception("Reset link has expired. Please request a new one.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        emailService.sendPasswordChangedEmail(user.getEmail(), user.getFullName());
    }

    @Override
    public void changePassword(String authToken, String oldPassword, String newPassword) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(authToken);
        User user = userRepository.findByEmail(email);
        if (user == null) throw new Exception("User not found.");
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new Exception("Current password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        emailService.sendPasswordChangedEmail(user.getEmail(), user.getFullName());
    }
}
