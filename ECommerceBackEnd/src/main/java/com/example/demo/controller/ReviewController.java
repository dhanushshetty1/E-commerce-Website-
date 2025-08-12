package com.example.demo.controller;

import com.example.demo.Entities.Review;
import com.example.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @PostMapping("/reviews")
    public Review add(@RequestBody Review r) { return reviewService.save(r); }

    @GetMapping("/reviews/product/{productId}")
    public List<Review> listByProduct(@PathVariable Integer productId) { return reviewService.findByProduct(productId); }
}