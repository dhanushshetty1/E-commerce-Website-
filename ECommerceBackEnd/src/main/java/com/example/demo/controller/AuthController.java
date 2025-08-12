package com.example.demo.controller;

import com.example.demo.Entities.Role;
import com.example.demo.Entities.User;
import com.example.demo.dao.RoleRepository;
import com.example.demo.payload.AuthRequest;
import com.example.demo.payload.AuthResponse;
import com.example.demo.payload.RegisterRequest;
import com.example.demo.security.JwtService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserService userService;
  private final RoleRepository roleRepo;
  private final BCryptPasswordEncoder encoder;
  private final JwtService jwtService;
  private final AuthenticationManager authManager;

  public AuthController(UserService userService,
                        RoleRepository roleRepo,
                        BCryptPasswordEncoder encoder,
                        JwtService jwtService,
                        AuthenticationManager authManager) {
    this.userService = userService;
    this.roleRepo = roleRepo;
    this.encoder = encoder;
    this.jwtService = jwtService;
    this.authManager = authManager;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
    if (userService.findByEmail(req.getEmail()) != null) {
      return ResponseEntity.badRequest().body("Email already in use");
    }
    User u = new User();
    // u.setName(req.getName()); // ← REMOVE: User has no name field
    u.setEmail(req.getEmail());
    u.setPassword(encoder.encode(req.getPassword()));

    Role role = roleRepo.findByName("ROLE_USER");
    if (role == null) {
      role = new Role();
      role.setName("ROLE_USER");
      role = roleRepo.save(role);
    }
    u.getRoles().add(role);

    User saved = userService.save(u);
    String token = jwtService.generateToken(saved);

    AuthResponse.UserDto dto = new AuthResponse.UserDto(
        saved.getId(),                                  // ← Long
        saved.getEmail(),
        saved.getRoles().stream().findFirst().map(Role::getName).orElse(null)
    );

    return ResponseEntity.ok(new AuthResponse(token, dto));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody AuthRequest req) {
    try {
      authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
    } catch (AuthenticationException ex) {
      return ResponseEntity.status(401).body("Invalid email or password");
    }

    User user = userService.findByEmail(req.getEmail());
    if (user == null) return ResponseEntity.status(401).body("User not found");

    String token = jwtService.generateToken(user);
    AuthResponse.UserDto dto = new AuthResponse.UserDto(
        user.getId(),                                   // ← Long
        user.getEmail(),
        user.getRoles().stream().findFirst().map(Role::getName).orElse(null)
    );

    return ResponseEntity.ok(new AuthResponse(token, dto));
  }

}
