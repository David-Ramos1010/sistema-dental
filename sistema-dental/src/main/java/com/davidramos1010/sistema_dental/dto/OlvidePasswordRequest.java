package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OlvidePasswordRequest(
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Correo no válido")
        String email) {
}