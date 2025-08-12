package com.example.demo.dao;

//import com.example.demo.Entities.Role;
import com.example.demo.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> { }