package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.dto.PacienteResponse;
import com.davidramos1010.sistema_dental.dto.PacienteUpdateRequest;
import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.entity.Paciente;
import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.exception.RecursoNoEncontradoException;
import com.davidramos1010.sistema_dental.repository.PacienteRepository;
import com.davidramos1010.sistema_dental.security.UsuarioActual;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioActual usuarioActual;

    @Transactional(readOnly = true)
    public PageResponse<PacienteResponse> listar(String q, Pageable pageable) {
        return PageResponse.from(
                pacienteRepository.buscar(TratamientoService.normalizar(q), pageable).map(PacienteService::aResponse));
    }

    @Transactional(readOnly = true)
    public PacienteResponse obtener(Long id) {
        return aResponse(buscarEntidad(id));
    }

    @Transactional
    public PacienteResponse actualizar(Long id, PacienteUpdateRequest req) {
        Paciente p = buscarEntidad(id);
        aplicar(p, req);
        return aResponse(p);
    }

    @Transactional(readOnly = true)
    public PacienteResponse miPerfil() {
        return aResponse(propio());
    }

    @Transactional
    public PacienteResponse actualizarMiPerfil(PacienteUpdateRequest req) {
        Paciente p = propio();
        aplicar(p, req);
        return aResponse(p);
    }

    private Paciente propio() {
        Usuario u = usuarioActual.obtener();
        return pacienteRepository.findByUsuarioId(u.getId())
                .orElseThrow(() -> new RecursoNoEncontradoException("No tienes perfil de paciente"));
    }

    private Paciente buscarEntidad(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Paciente no encontrado"));
    }

    private void aplicar(Paciente p, PacienteUpdateRequest req) {
        p.getUsuario().setNombre(req.nombre().trim());
        p.getUsuario().setTelefono(req.telefono());
        p.setFechaNacimiento(req.fechaNacimiento());
        p.setDireccion(req.direccion());
        p.setNotasMedicas(req.notasMedicas());
    }

    static PacienteResponse aResponse(Paciente p) {
        Usuario u = p.getUsuario();
        return new PacienteResponse(p.getId(), u.getId(), u.getNombre(), u.getEmail(), u.getTelefono(),
                p.getFechaNacimiento(), p.getDireccion(), p.getNotasMedicas());
    }
}