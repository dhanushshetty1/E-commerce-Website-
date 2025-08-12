package com.example.demo.controller;

import com.example.demo.Entities.Cart;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired private CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable Integer userId) { return cartService.getCartByUserId(userId); }

    @PostMapping("/add/{userId}/{productId}")
    public Cart addToCart(@PathVariable Integer userId, @PathVariable Integer productId) {
        return cartService.addToCart(userId, productId);
    }

    @DeleteMapping("/remove/{userId}/{productId}")
    public Cart remove(@PathVariable Integer userId, @PathVariable Integer productId) {
        return cartService.removeFromCart(userId, productId);
    }

    @DeleteMapping("/clear/{userId}")
    public String clear(@PathVariable Integer userId) {
        cartService.clearCart(userId);
        return "Cleared";
    }
}
