package com.davidramos1010.sistema_dental.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/prueba")
public class PruebaRolesController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> soloAdmin() {
        return Map.of("mensaje", "Hola, administrador");
    }

    @GetMapping("/personal")
    @PreAuthorize("hasAnyRole('ADMIN', 'DENTISTA')")
    public Map<String, String> adminYDentista() {
        return Map.of("mensaje", "Hola, personal de la clínica");
    }

    @GetMapping("/paciente")
    @PreAuthorize("hasRole('PACIENTE')")
    public Map<String, String> soloPaciente() {
        return Map.of("mensaje", "Hola, paciente");
    }
}