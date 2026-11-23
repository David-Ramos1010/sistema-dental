package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RestablecerPasswordRequest(
        @NotBlank(message = "El token es obligatorio")
        String token,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(max = 72, message = "La contraseña no puede exceder 72 caracteres")
        @Pattern(regexp = PasswordRules.REGEX, message = PasswordRules.MENSAJE)
        String nuevaPassword) {
}