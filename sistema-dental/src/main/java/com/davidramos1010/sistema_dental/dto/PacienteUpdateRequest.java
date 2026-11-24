package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PacienteUpdateRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @Pattern(regexp = "^\\+[1-9]\\d{7,14}$",
                message = "Usa formato internacional, por ejemplo +5219511234567")
        String telefono,

        @Past(message = "La fecha de nacimiento debe ser pasada")
        LocalDate fechaNacimiento,

        @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
        String direccion,

        @Size(max = 500, message = "Las notas no pueden exceder 500 caracteres")
        String notasMedicas) {
}