package com.davidramos1010.sistema_dental.dto;

public record LoginResponse(String token, String tipo, String nombre, String email, String rol) {
}