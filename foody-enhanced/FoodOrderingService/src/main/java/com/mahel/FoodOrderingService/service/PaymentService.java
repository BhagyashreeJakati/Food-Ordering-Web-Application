package com.mahel.FoodOrderingService.service;

import com.mahel.FoodOrderingService.dto.response.PaymentResponse;
import com.mahel.FoodOrderingService.model.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.api.key:rzp_test_placeholder}")
    private String razorpayKeyId;

    @Value("${razorpay.api.secret:REPLACE_WITH_YOUR_RAZORPAY_SECRET}")
    private String razorpayKeySecret;

    public PaymentResponse createPaymentLink(Order order) throws Exception {
        PaymentResponse response = new PaymentResponse();

        boolean isConfigured = razorpayKeySecret != null
                && !razorpayKeySecret.isBlank()
                && !razorpayKeySecret.equals("REPLACE_WITH_YOUR_RAZORPAY_SECRET");

        if (!isConfigured) {
            // Demo mode — redirect to success page directly
            String demoUrl = "http://localhost:3000/payment/success"
                    + "?razorpay_payment_id=demo_pay_" + order.getId()
                    + "&order_id=" + order.getId()
                    + "&demo=true";
            response.setPayment_url(demoUrl);
            System.out.println("[PaymentService] DEMO MODE — Razorpay not configured. Demo URL generated for order #" + order.getId());
            return response;
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject req = new JSONObject();
            req.put("amount", (order.getTotalPrice() != null ? order.getTotalPrice() : 100) * 100);
            req.put("currency", "INR");
            req.put("description", "Foody Order #" + order.getId());

            JSONObject customer = new JSONObject();
            customer.put("name", order.getCustomer() != null ? order.getCustomer().getFullName() : "Customer");
            customer.put("email", order.getCustomer() != null ? order.getCustomer().getEmail() : "customer@foody.com");
            req.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("sms", false); notify.put("email", false);
            req.put("notify", notify);
            req.put("callback_url", "http://localhost:3000/payment/success?order_id=" + order.getId());
            req.put("callback_method", "get");

            com.razorpay.PaymentLink payment = razorpay.paymentLink.create(req);
            response.setPayment_url(payment.get("short_url"));
        } catch (RazorpayException e) {
            System.err.println("[PaymentService] Razorpay error: " + e.getMessage() + " — falling back to demo mode");
            String demoUrl = "http://localhost:3000/payment/success?razorpay_payment_id=demo_pay_" + order.getId() + "&order_id=" + order.getId() + "&demo=true";
            response.setPayment_url(demoUrl);
        }
        return response;
    }
}
