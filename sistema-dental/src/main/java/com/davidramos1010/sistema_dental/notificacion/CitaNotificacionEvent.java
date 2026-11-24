package com.davidramos1010.sistema_dental.notificacion;

import java.time.LocalDateTime;

public record CitaNotificacionEvent(TipoNotificacion tipo,
                                    String pacienteNombre,
                                    String pacienteEmail,
                                    String pacienteTelefono,
                                    String dentistaNombre,
                                    LocalDateTime fechaHora,
                                    String motivo) {
}