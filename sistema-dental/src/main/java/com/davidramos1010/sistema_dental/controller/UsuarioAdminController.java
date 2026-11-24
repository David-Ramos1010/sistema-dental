package com.davidramos1010.sistema_dental.controller;

import com.davidramos1010.sistema_dental.dto.ActivoRequest;
import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.dto.UsuarioAdminActualizarRequest;
import com.davidramos1010.sistema_dental.dto.UsuarioAdminCrearRequest;
import com.davidramos1010.sistema_dental.dto.UsuarioAdminResponse;
import com.davidramos1010.sistema_dental.service.UsuarioAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UsuarioAdminController {

    private final UsuarioAdminService usuarioAdminService;

    @GetMapping
    public PageResponse<UsuarioAdminResponse> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) Boolean activo,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return usuarioAdminService.listar(q, rol, activo, pageable);
    }

    @GetMapping("/{id}")
    public UsuarioAdminResponse obtener(@PathVariable Long id) {
        return usuarioAdminService.obtener(id);
    }

    @PostMapping
    public ResponseEntity<UsuarioAdminResponse> crear(@Valid @RequestBody UsuarioAdminCrearRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioAdminService.crear(req));
    }

    @PutMapping("/{id}")
    public UsuarioAdminResponse actualizar(@PathVariable Long id,
                                           @Valid @RequestBody UsuarioAdminActualizarRequest req) {
        return usuarioAdminService.actualizar(id, req);
    }

    @PatchMapping("/{id}/activo")
    public UsuarioAdminResponse cambiarActivo(@PathVariable Long id, @Valid @RequestBody ActivoRequest req) {
        return usuarioAdminService.cambiarActivo(id, req.activo());
    }
}