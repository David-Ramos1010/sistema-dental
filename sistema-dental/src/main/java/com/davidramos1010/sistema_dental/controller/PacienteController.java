package com.davidramos1010.sistema_dental.controller;

import com.davidramos1010.sistema_dental.dto.PacienteResponse;
import com.davidramos1010.sistema_dental.dto.PacienteUpdateRequest;
import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DENTISTA')")
    public PageResponse<PacienteResponse> listar(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return pacienteService.listar(q, pageable);
    }

    @GetMapping("/mi-perfil")
    @PreAuthorize("hasRole('PACIENTE')")
    public PacienteResponse miPerfil() {
        return pacienteService.miPerfil();
    }

    @PutMapping("/mi-perfil")
    @PreAuthorize("hasRole('PACIENTE')")
    public PacienteResponse actualizarMiPerfil(@Valid @RequestBody PacienteUpdateRequest req) {
        return pacienteService.actualizarMiPerfil(req);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DENTISTA')")
    public PacienteResponse obtener(@PathVariable Long id) {
        return pacienteService.obtener(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DENTISTA')")
    public PacienteResponse actualizar(@PathVariable Long id, @Valid @RequestBody PacienteUpdateRequest req) {
        return pacienteService.actualizar(id, req);
    }
}