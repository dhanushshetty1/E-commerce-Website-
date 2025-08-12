package com.example.demo.service;

import com.example.demo.dao.OrderRepository;
import com.example.demo.Entities.Cart;
import com.example.demo.Entities.Order;
import com.example.demo.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartService cartService;
    @Autowired private UserService userService;

    public List<Order> listAll() { return orderRepository.findAll(); }
    public Order findById(Integer id) { return orderRepository.findById(id).orElse(null); }

    public Order checkoutFromCart(Integer userId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart == null || cart.getProducts().isEmpty()) return null;

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setProducts(cart.getProducts());
        order.setTotalAmount(cart.getTotalAmount());
        order.setStatus("CREATED");

        Order saved = orderRepository.save(order);
        cartService.clearCart(userId);
        return saved;
    }
}
