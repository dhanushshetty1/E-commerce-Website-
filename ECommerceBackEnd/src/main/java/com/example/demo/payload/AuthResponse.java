package com.example.demo.payload;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    // getters & setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    // Nested DTO the controller builds with: new AuthResponse.UserDto(Long, String, String)
    public static class UserDto {
        private Long id;
        private String email;
        private String role;

        public UserDto() {}

        public UserDto(Long id, String email, String role) {
            this.id = id;
            this.email = email;
            this.role = role;
        }

        // getters & setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
