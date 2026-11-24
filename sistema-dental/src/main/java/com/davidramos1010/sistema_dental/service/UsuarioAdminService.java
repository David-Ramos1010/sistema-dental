package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.dto.UsuarioAdminActualizarRequest;
import com.davidramos1010.sistema_dental.dto.UsuarioAdminCrearRequest;
import com.davidramos1010.sistema_dental.dto.UsuarioAdminResponse;
import com.davidramos1010.sistema_dental.entity.Dentista;
import com.davidramos1010.sistema_dental.entity.Especialidad;
import com.davidramos1010.sistema_dental.entity.Paciente;
import com.davidramos1010.sistema_dental.entity.Rol;
import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.exception.RecursoNoEncontradoException;
import com.davidramos1010.sistema_dental.exception.ReglaNegocioException;
import com.davidramos1010.sistema_dental.repository.DentistaRepository;
import com.davidramos1010.sistema_dental.repository.EspecialidadRepository;
import com.davidramos1010.sistema_dental.repository.PacienteRepository;
import com.davidramos1010.sistema_dental.repository.RolRepository;
import com.davidramos1010.sistema_dental.repository.UsuarioRepository;
import com.davidramos1010.sistema_dental.security.UsuarioActual;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioAdminService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PacienteRepository pacienteRepository;
    private final DentistaRepository dentistaRepository;
    private final EspecialidadRepository especialidadRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioActual usuarioActual;

    @Transactional(readOnly = true)
    public PageResponse<UsuarioAdminResponse> listar(String q, String rol, Boolean activo, Pageable pageable) {
        String rolFiltro = (rol == null || rol.isBlank()) ? null : rol.trim().toUpperCase();
        return PageResponse.from(
                usuarioRepository.buscar(TratamientoService.normalizar(q), rolFiltro, activo, pageable)
                        .map(UsuarioAdminService::aResponse));
    }

    @Transactional(readOnly = true)
    public UsuarioAdminResponse obtener(Long id) {
        return aResponse(buscarEntidad(id));
    }

    @Transactional
    public UsuarioAdminResponse crear(UsuarioAdminCrearRequest req) {
        String email = req.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new ReglaNegocioException("El correo ya está registrado");
        }
        Rol rol = rolRepository.findByNombre(req.rol())
                .orElseThrow(() -> new ReglaNegocioException("El rol no existe"));

        Especialidad especialidad = null;
        String cedula = null;
        if ("DENTISTA".equals(req.rol())) {
            if (req.especialidadId() == null || req.cedula() == null || req.cedula().isBlank()) {
                throw new ReglaNegocioException("Para un dentista se requieren la especialidad y la cédula");
            }
            especialidad = especialidadRepository.findById(req.especialidadId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Especialidad no encontrada"));
            cedula = req.cedula().trim();
            if (dentistaRepository.existsByCedula(cedula)) {
                throw new ReglaNegocioException("La cédula ya está registrada");
            }
        }

        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(req.password()));
        u.setTelefono(req.telefono());
        u.setRol(rol);
        usuarioRepository.save(u);

        if ("PACIENTE".equals(req.rol())) {
            Paciente p = new Paciente();
            p.setUsuario(u);
            pacienteRepository.save(p);
        } else if ("DENTISTA".equals(req.rol())) {
            Dentista d = new Dentista();
            d.setUsuario(u);
            d.setEspecialidad(especialidad);
            d.setCedula(cedula);
            dentistaRepository.save(d);
        }
        return aResponse(u);
    }

    @Transactional
    public UsuarioAdminResponse actualizar(Long id, UsuarioAdminActualizarRequest req) {
        Usuario u = buscarEntidad(id);
        u.setNombre(req.nombre().trim());
        u.setTelefono(req.telefono());
        return aResponse(u);
    }

    @Transactional
    public UsuarioAdminResponse cambiarActivo(Long id, boolean activo) {
        Usuario u = buscarEntidad(id);
        if (!activo && u.getId().equals(usuarioActual.obtener().getId())) {
            throw new ReglaNegocioException("No puedes desactivar tu propia cuenta");
        }
        u.setActivo(activo);
        return aResponse(u);
    }

    private Usuario buscarEntidad(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    static UsuarioAdminResponse aResponse(Usuario u) {
        return new UsuarioAdminResponse(u.getId(), u.getNombre(), u.getEmail(), u.getTelefono(),
                u.getRol().getNombre(), u.isActivo());
    }
}