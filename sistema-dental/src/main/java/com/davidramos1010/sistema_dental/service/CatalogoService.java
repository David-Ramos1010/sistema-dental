package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.dto.DentistaResponse;
import com.davidramos1010.sistema_dental.dto.EspecialidadResponse;
import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.entity.Dentista;
import com.davidramos1010.sistema_dental.repository.DentistaRepository;
import com.davidramos1010.sistema_dental.repository.EspecialidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogoService {

    private final DentistaRepository dentistaRepository;
    private final EspecialidadRepository especialidadRepository;

    @Transactional(readOnly = true)
    public PageResponse<DentistaResponse> dentistas(String q, Long especialidadId, Pageable pageable) {
        return PageResponse.from(
                dentistaRepository.buscar(TratamientoService.normalizar(q), especialidadId, pageable)
                        .map(CatalogoService::aResponse));
    }

    @Transactional(readOnly = true)
    public List<EspecialidadResponse> especialidades() {
        return especialidadRepository.findAll(Sort.by("nombre")).stream()
                .map(e -> new EspecialidadResponse(e.getId(), e.getNombre()))
                .toList();
    }

    static DentistaResponse aResponse(Dentista d) {
        return new DentistaResponse(d.getId(), d.getUsuario().getNombre(), d.getUsuario().getEmail(),
                d.getUsuario().getTelefono(), d.getEspecialidad().getNombre(), d.getCedula());
    }
}