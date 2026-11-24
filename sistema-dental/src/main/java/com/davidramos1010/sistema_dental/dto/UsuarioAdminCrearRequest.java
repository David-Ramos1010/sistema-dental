package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioAdminCrearRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "Correo no válido")
        @Size(max = 150, message = "El correo no puede exceder 150 caracteres")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(max = 72, message = "La contraseña no puede exceder 72 caracteres")
        @Pattern(regexp = PasswordRules.REGEX, message = PasswordRules.MENSAJE)
        String password,

        @Pattern(regexp = "^\\+[1-9]\\d{7,14}$",
                message = "Usa formato internacional, por ejemplo +5219511234567")
        String telefono,

        @NotBlank(message = "El rol es obligatorio")
        @Pattern(regexp = "ADMIN|DENTISTA|PACIENTE", message = "Rol no válido (ADMIN, DENTISTA o PACIENTE)")
        String rol,

        Long especialidadId, 

        @Size(max = 20, message = "La cédula no puede exceder 20 caracteres")
        String cedula) {    
}