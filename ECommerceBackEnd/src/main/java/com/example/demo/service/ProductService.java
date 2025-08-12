package com.example.demo.service;

import com.example.demo.dao.ProductRepository;
import com.example.demo.Entities.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired private ProductRepository productRepository;

    public List<Product> listAll() { return productRepository.findAll(); }
    public Product findById(Integer id) { return productRepository.findById(id).orElse(null); }
    public Product save(Product p) { return productRepository.save(p); }
    public void delete(Integer id) { productRepository.deleteById(id); }
}