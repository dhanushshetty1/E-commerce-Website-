package com.example.demo.service;

import com.example.demo.dao.ReviewRepository;
import com.example.demo.Entities.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    @Autowired private ReviewRepository reviewRepository;

    public Review save(Review r) { return reviewRepository.save(r); }
    public List<Review> findByProduct(Integer productId) { return reviewRepository.findByProductId(productId); }
}
