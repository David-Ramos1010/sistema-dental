package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Set;

public record CitaRequest(
        Long pacienteId, 
        @NotNull(message = "El dentista es obligatorio")
        Long dentistaId, 
        @NotNull(message = "La fecha y hora son obligatorias")
        @Future(message = "La fecha debe ser futura")
        LocalDateTime fechaHora,

        @NotBlank(message = "El motivo es obligatorio")
        @Size(max = 200, message = "El motivo no puede exceder 200 caracteres")
        String motivo,

        @Size(max = 500, message = "Las notas no pueden exceder 500 caracteres")
        String notas,

        Set<Long> tratamientoIds) {
}