package com.davidramos1010.sistema_dental.controller;

import com.davidramos1010.sistema_dental.dto.DentistaResponse;
import com.davidramos1010.sistema_dental.dto.EspecialidadResponse;
import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.service.CatalogoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoService catalogoService;

    @GetMapping("/dentistas")
    public PageResponse<DentistaResponse> dentistas(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long especialidadId,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return catalogoService.dentistas(q, especialidadId, pageable);
    }

    @GetMapping("/especialidades")
    public List<EspecialidadResponse> especialidades() {
        return catalogoService.especialidades();
    }
}