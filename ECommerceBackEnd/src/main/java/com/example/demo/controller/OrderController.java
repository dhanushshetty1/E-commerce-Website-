package com.example.demo.controller;

import com.example.demo.Entities.Order;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderService orderService;

    @GetMapping
    public List<Order> all() { return orderService.listAll(); }

    @GetMapping("/{id}")
    public Order get(@PathVariable Integer id) { return orderService.findById(id); }

    @PostMapping("/checkout/{userId}")
    public Order checkout(@PathVariable Integer userId) { return orderService.checkoutFromCart(userId); }
}
