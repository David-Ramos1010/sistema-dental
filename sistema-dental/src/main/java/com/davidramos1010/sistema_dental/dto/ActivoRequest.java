package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.NotNull;

public record ActivoRequest(
        @NotNull(message = "El campo activo es obligatorio")
        Boolean activo) {
}