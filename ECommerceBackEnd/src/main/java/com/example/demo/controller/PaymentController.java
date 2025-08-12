package com.example.demo.controller;

import com.example.demo.Entities.Payment;
import com.example.demo.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired private PaymentService paymentService;

    @PostMapping("/{orderId}")
    public Payment pay(@PathVariable Integer orderId) { return paymentService.processPayment(orderId); }
}
