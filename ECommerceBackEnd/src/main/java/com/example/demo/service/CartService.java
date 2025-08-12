package com.example.demo.service;


import com.example.demo.dao.CartRepository;
import com.example.demo.dao.ProductRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.Entities.Cart;
import com.example.demo.Entities.Product;
import com.example.demo.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    public Cart getCartByUserId(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        return user == null ? null : cartRepository.findByUser(user);
    }

    public Cart addToCart(Integer userId, Integer productId) {
        User user = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);
        if (user == null || product == null) return null;

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) { cart = new Cart(); cart.setUser(user); }
        cart.getProducts().add(product);
        cart.calculateTotal();
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Integer userId, Integer productId) {
        User user = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);
        if (user == null || product == null) return null;

        Cart cart = cartRepository.findByUser(user);
        if (cart != null) {
            cart.getProducts().removeIf(p -> p.getId().equals(product.getId()));
            cart.calculateTotal();
            return cartRepository.save(cart);
        }
        return null;
    }

    public void clearCart(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        Cart cart = cartRepository.findByUser(user);
        if (cart != null) {
            cart.getProducts().clear();
            cart.calculateTotal();
            cartRepository.save(cart);
        }
    }
}
