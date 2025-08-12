package com.example.demo.dao;
//import com.example.demo.Entities.Product;

import com.example.demo.Entities.Cart;
import com.example.demo.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findByUser(User user);
}
