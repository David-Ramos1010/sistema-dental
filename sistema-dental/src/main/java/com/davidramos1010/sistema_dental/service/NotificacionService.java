package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.notificacion.CitaNotificacionEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificacionService {

    private static final DateTimeFormatter FORMATO =
            DateTimeFormatter.ofPattern("EEEE d 'de' MMMM 'a las' HH:mm", Locale.forLanguageTag("es-MX"));

    private final EmailService emailService;
    private final TwilioService twilioService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void alCambiarCita(CitaNotificacionEvent e) {
        String fecha = e.fechaHora().format(FORMATO);

        String asunto;
        String mensaje;
        switch (e.tipo()) {
            case CREADA -> {
                asunto = "Cita registrada";
                mensaje = "Sistema Dental: tu cita con " + e.dentistaNombre() + " quedó registrada para el "
                        + fecha + ". Motivo: " + e.motivo() + ".";
            }
            case CONFIRMADA -> {
                asunto = "Cita confirmada";
                mensaje = "Sistema Dental: tu cita con " + e.dentistaNombre() + " del " + fecha
                        + " fue confirmada. ¡Te esperamos!";
            }
            case CANCELADA -> {
                asunto = "Cita cancelada";
                mensaje = "Sistema Dental: tu cita con " + e.dentistaNombre() + " del " + fecha
                        + " fue cancelada.";
            }
            case REPROGRAMADA -> {
                asunto = "Cita reprogramada";
                mensaje = "Sistema Dental: tu cita con " + e.dentistaNombre()
                        + " fue reprogramada para el " + fecha + ".";
            }
            default -> {
                return;
            }
        }

        emailService.enviar(e.pacienteEmail(), asunto + " - Sistema Dental",
                "Hola " + e.pacienteNombre() + ",\n\n" + mensaje);

        String telefono = e.pacienteTelefono();
        if (telefono != null && !telefono.isBlank()) {
            twilioService.enviarSms(telefono, mensaje);
            twilioService.enviarWhatsapp(telefono, mensaje);
        } else {
            log.info("El paciente {} no tiene teléfono: se omiten SMS y WhatsApp", e.pacienteEmail());
        }
    }
}