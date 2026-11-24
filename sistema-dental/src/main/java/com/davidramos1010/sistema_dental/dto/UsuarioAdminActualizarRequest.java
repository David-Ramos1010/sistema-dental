package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioAdminActualizarRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @Pattern(regexp = "^\\+[1-9]\\d{7,14}$",
                message = "Usa formato internacional, por ejemplo +5219511234567")
        String telefono) {
}