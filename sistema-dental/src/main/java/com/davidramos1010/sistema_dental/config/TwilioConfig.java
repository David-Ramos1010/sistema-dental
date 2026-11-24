package com.davidramos1010.sistema_dental.config;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class TwilioConfig {

    @Value("${twilio.enabled:false}")
    private boolean enabled;

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @PostConstruct
    void iniciar() {
        if (enabled) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio inicializado");
        } else {
            log.info("Twilio desactivado (twilio.enabled=false): los mensajes solo se escribirán en el log");
        }
    }
}