package com.davidramos1010.sistema_dental.dto;

import com.davidramos1010.sistema_dental.entity.EstadoCita;
import jakarta.validation.constraints.NotNull;

public record CitaEstadoRequest(
        @NotNull(message = "El estado es obligatorio")
        EstadoCita estado) {
}