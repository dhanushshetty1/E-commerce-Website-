package com.example.demo.dao;
//import com.example.demo.Entities.Product;
import com.example.demo.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer>{}