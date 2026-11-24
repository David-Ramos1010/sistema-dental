package com.davidramos1010.sistema_dental.dto;

import java.math.BigDecimal;

public record TratamientoResponse(Long id, String nombre, String descripcion,
                                   BigDecimal precio, Integer duracionMin, boolean activo) {
}