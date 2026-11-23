package com.davidramos1010.sistema_dental.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(int status, String mensaje, Map<String, String> errores, LocalDateTime fecha) {
}