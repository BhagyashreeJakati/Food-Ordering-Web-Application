package com.mahel.FoodOrderingService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@foody.com}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    public void sendPasswordResetEmail(String toEmail, String token, String userName) {
        if (mailSender == null) {
            System.out.println("📧 [DEMO] Password reset email to: " + toEmail);
            System.out.println("📧 [DEMO] Reset link: " + baseUrl + "/reset-password?token=" + token);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Foody — Reset your password");
            message.setText(
                "Hi " + userName + ",\n\n" +
                "We received a request to reset your Foody password.\n\n" +
                "Click the link below to reset it (valid for 15 minutes):\n\n" +
                baseUrl + "/reset-password?token=" + token + "\n\n" +
                "If you didn't request this, ignore this email — your password won't change.\n\n" +
                "— The Foody Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("⚠️ Email send failed: " + e.getMessage());
        }
    }

    public void sendLoginAlertEmail(String toEmail, String userName) {
        if (mailSender == null) {
            System.out.println("📧 [DEMO] Login alert email to: " + toEmail);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Foody — New login detected");
            message.setText(
                "Hi " + userName + ",\n\n" +
                "A new login was detected on your Foody account.\n\n" +
                "Time: " + java.time.LocalDateTime.now() + "\n\n" +
                "If this was you, no action needed.\n" +
                "If this wasn't you, please reset your password immediately.\n\n" +
                "— The Foody Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("⚠️ Login alert email failed: " + e.getMessage());
        }
    }

    public void sendPasswordChangedEmail(String toEmail, String userName) {
        if (mailSender == null) {
            System.out.println("📧 [DEMO] Password changed email to: " + toEmail);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Foody — Password changed successfully");
            message.setText(
                "Hi " + userName + ",\n\n" +
                "Your Foody password was successfully changed.\n\n" +
                "If you didn't make this change, contact us immediately.\n\n" +
                "— The Foody Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("⚠️ Password changed email failed: " + e.getMessage());
        }
    }
}
