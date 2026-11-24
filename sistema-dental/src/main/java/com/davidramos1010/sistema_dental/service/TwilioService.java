package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.notificacion.TelefonoUtil;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TwilioService {

    @Value("${twilio.enabled:false}")
    private boolean enabled;

    @Value("${twilio.sms-from:}")
    private String smsFrom;

    // Solo para cuentas de prueba: nombre de la plantilla predefinida que se envía en lugar del texto libre
    @Value("${twilio.sms-plantilla:}")
    private String smsPlantilla;

    @Value("${twilio.whatsapp-from:}")
    private String whatsappFrom;

    public void enviarSms(String telefono, String texto) {
        boolean usaPlantilla = smsPlantilla != null && !smsPlantilla.isBlank();
        String cuerpo = usaPlantilla ? smsPlantilla : texto;

        if (!enabled) {
            log.info("[Twilio desactivado] SMS a {}: {}", telefono, texto);
            return;
        }
        try {
            Message m = Message.creator(
                    new PhoneNumber(TelefonoUtil.paraSms(telefono)),
                    new PhoneNumber(smsFrom),
                    cuerpo).create();
            log.info("SMS enviado a {} (sid {}, estado {}{})", telefono, m.getSid(), m.getStatus(),
                    usaPlantilla ? ", plantilla " + smsPlantilla : "");
        } catch (Exception e) {
            log.error("No se pudo enviar el SMS a {}: {}", telefono, e.getMessage());
        }
    }

    public void enviarWhatsapp(String telefono, String texto) {
        if (!enabled) {
            log.info("[Twilio desactivado] WhatsApp a {}: {}", telefono, texto);
            return;
        }
        try {
            Message m = Message.creator(
                    new PhoneNumber("whatsapp:" + TelefonoUtil.paraWhatsapp(telefono)),
                    new PhoneNumber(whatsappFrom), // ya incluye el prefijo "whatsapp:"
                    texto).create();
            log.info("WhatsApp enviado a {} (sid {}, estado {})", telefono, m.getSid(), m.getStatus());
        } catch (Exception e) {
            log.error("No se pudo enviar el WhatsApp a {}: {}", telefono, e.getMessage());
        }
    }
}