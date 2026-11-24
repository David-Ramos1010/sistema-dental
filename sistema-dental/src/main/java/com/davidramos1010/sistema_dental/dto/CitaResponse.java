package com.davidramos1010.sistema_dental.dto;

import com.davidramos1010.sistema_dental.entity.EstadoCita;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CitaResponse(Long id, Long pacienteId, String pacienteNombre,
                            Long dentistaId, String dentistaNombre, String especialidad,
                            LocalDateTime fechaHora, EstadoCita estado, String motivo, String notas,
                            List<TratamientoResponse> tratamientos, BigDecimal total) {
}