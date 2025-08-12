package com.example.demo.controller;

import com.example.demo.Entities.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {
    @Autowired private ProductService productService;

    @GetMapping("/products")
    public List<Product> all() { return productService.listAll(); }

    @GetMapping("/product/{id}")
    public Product get(@PathVariable Integer id) { return productService.findById(id); }

    @PostMapping("/product")
    public Product add(@RequestBody Product p) { return productService.save(p); }

    @PutMapping("/product/{id}")
    public Product update(@PathVariable Integer id, @RequestBody Product p) {
        p.setId(id);
        return productService.save(p);
    }

    @DeleteMapping("/product/{id}")
    public String delete(@PathVariable Integer id) {
        productService.delete(id);
        return "Deleted";
    }
}
