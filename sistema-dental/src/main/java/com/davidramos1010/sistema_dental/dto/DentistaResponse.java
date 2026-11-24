package com.davidramos1010.sistema_dental.dto;

public record DentistaResponse(Long id, String nombre, String email, String telefono,
                                String especialidad, String cedula) {
}