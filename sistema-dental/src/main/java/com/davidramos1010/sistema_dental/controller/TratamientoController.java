package com.davidramos1010.sistema_dental.controller;

import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.dto.TratamientoRequest;
import com.davidramos1010.sistema_dental.dto.TratamientoResponse;
import com.davidramos1010.sistema_dental.service.TratamientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tratamientos")
@RequiredArgsConstructor
public class TratamientoController {

    private final TratamientoService tratamientoService;

    @GetMapping
    public PageResponse<TratamientoResponse> listar(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean activo,
            @PageableDefault(size = 10, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable) {
        return tratamientoService.listar(q, activo, pageable);
    }

    @GetMapping("/{id}")
    public TratamientoResponse obtener(@PathVariable Long id) {
        return tratamientoService.obtener(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TratamientoResponse> crear(@Valid @RequestBody TratamientoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tratamientoService.crear(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public TratamientoResponse actualizar(@PathVariable Long id, @Valid @RequestBody TratamientoRequest req) {
        return tratamientoService.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tratamientoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}