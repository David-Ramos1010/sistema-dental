package com.davidramos1010.sistema_dental.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    public void enviarRecuperacion(String para, String nombre, String enlace) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(from);
        mensaje.setTo(para);
        mensaje.setSubject("Recuperación de contraseña - Sistema Dental");
        mensaje.setText("Hola " + nombre + ",\n\n"
                + "Recibimos una solicitud para restablecer tu contraseña. "
                + "Entra al siguiente enlace (vigente 30 minutos):\n\n"
                + enlace + "\n\n"
                + "Si no fuiste tú, ignora este mensaje.");
        try {
            mailSender.send(mensaje);
        } catch (MailException e) {
            log.error("No se pudo enviar el correo a {}: {}", para, e.getMessage());
        }
    }
}