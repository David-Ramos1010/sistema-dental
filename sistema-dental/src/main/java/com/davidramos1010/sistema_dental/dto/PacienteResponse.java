package com.davidramos1010.sistema_dental.dto;

import java.time.LocalDate;

public record PacienteResponse(Long id, Long usuarioId, String nombre, String email, String telefono,
                                LocalDate fechaNacimiento, String direccion, String notasMedicas) {
}