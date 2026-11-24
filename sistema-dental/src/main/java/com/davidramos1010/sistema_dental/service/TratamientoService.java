package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.dto.TratamientoRequest;
import com.davidramos1010.sistema_dental.dto.TratamientoResponse;
import com.davidramos1010.sistema_dental.entity.Tratamiento;
import com.davidramos1010.sistema_dental.exception.RecursoNoEncontradoException;
import com.davidramos1010.sistema_dental.exception.ReglaNegocioException;
import com.davidramos1010.sistema_dental.repository.TratamientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TratamientoService {

    private final TratamientoRepository tratamientoRepository;

    @Transactional(readOnly = true)
    public PageResponse<TratamientoResponse> listar(String q, Boolean activo, Pageable pageable) {
        return PageResponse.from(
                tratamientoRepository.buscar(normalizar(q), activo, pageable).map(TratamientoService::aResponse));
    }

    @Transactional(readOnly = true)
    public TratamientoResponse obtener(Long id) {
        return aResponse(buscarEntidad(id));
    }

    @Transactional
    public TratamientoResponse crear(TratamientoRequest req) {
        Tratamiento t = new Tratamiento();
        aplicar(t, req);
        return aResponse(tratamientoRepository.save(t));
    }

    @Transactional
    public TratamientoResponse actualizar(Long id, TratamientoRequest req) {
        Tratamiento t = buscarEntidad(id);
        aplicar(t, req);
        return aResponse(t);
    }

    @Transactional
    public void eliminar(Long id) {
        Tratamiento t = buscarEntidad(id);
        try {
            tratamientoRepository.delete(t);
            tratamientoRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ReglaNegocioException(
                    "No se puede eliminar: el tratamiento está en uso en citas. Desactívalo en su lugar.");
        }
    }

    private void aplicar(Tratamiento t, TratamientoRequest req) {
        String nombre = req.nombre().trim();
        t.setNombre(nombre);
        t.setDescripcion(req.descripcion());
        t.setPrecio(req.precio());
        t.setDuracionMin(req.duracionMin());
        t.setActivo(req.activo() == null || req.activo());
    }

    private Tratamiento buscarEntidad(Long id) {
        return tratamientoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Tratamiento no encontrado"));
    }

    static String normalizar(String q) {
        return (q == null || q.isBlank()) ? null : q.trim();
    }

    public static TratamientoResponse aResponse(Tratamiento t) {
        return new TratamientoResponse(t.getId(), t.getNombre(), t.getDescripcion(),
                t.getPrecio(), t.getDuracionMin(), t.isActivo());
    }
}