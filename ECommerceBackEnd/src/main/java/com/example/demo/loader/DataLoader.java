package com.example.demo.loader;

import com.example.demo.dao.RoleRepository;
import com.example.demo.Entities.Role;
import com.example.demo.Entities.User;
import com.example.demo.dao.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;

    public DataLoader(RoleRepository roleRepo, UserRepository userRepo, BCryptPasswordEncoder encoder) {
        this.roleRepo = roleRepo; this.userRepo = userRepo; this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Role rUser = roleRepo.findByName("ROLE_USER");
        if (rUser == null) {
            rUser = new Role();
            rUser.setName("ROLE_USER");
            roleRepo.save(rUser);
        }

        Role rAdmin = roleRepo.findByName("ROLE_ADMIN");
        if (rAdmin == null) {
            rAdmin = new Role();
            rAdmin.setName("ROLE_ADMIN");
            roleRepo.save(rAdmin);
        }

        if (userRepo.findByEmail("admin@example.com") == null) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRoles(Set.of(rAdmin));
            userRepo.save(admin);
        }
    }

}