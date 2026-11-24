package com.davidramos1010.sistema_dental.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record TratamientoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @Size(max = 300, message = "La descripción no puede exceder 300 caracteres")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.00", message = "El precio no puede ser negativo")
        @Digits(integer = 8, fraction = 2, message = "Precio no válido (máximo 2 decimales)")
        BigDecimal precio,

        @NotNull(message = "La duración es obligatoria")
        @Min(value = 5, message = "La duración mínima es de 5 minutos")
        @Max(value = 480, message = "La duración máxima es de 480 minutos")
        Integer duracionMin,

        Boolean activo) {
}