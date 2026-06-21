package com.mahel.FoodOrderingService.config;

public class JwtConstant {

    // Secret is loaded from environment variable JWT_SECRET_KEY
    // Fallback only used in local development — never deploy without setting the env var
    public static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY") != null
            ? System.getenv("JWT_SECRET_KEY")
            : "local-dev-secret-do-not-use-in-production-change-this-now";

    public static final String JWT_HEADER = "Authorization";
}
