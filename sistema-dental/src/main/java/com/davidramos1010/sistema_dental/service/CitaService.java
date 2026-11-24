package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.dto.CitaRequest;
import com.davidramos1010.sistema_dental.dto.CitaResponse;
import com.davidramos1010.sistema_dental.dto.PageResponse;
import com.davidramos1010.sistema_dental.dto.TratamientoResponse;
import com.davidramos1010.sistema_dental.entity.Cita;
import com.davidramos1010.sistema_dental.entity.Dentista;
import com.davidramos1010.sistema_dental.entity.EstadoCita;
import com.davidramos1010.sistema_dental.entity.Paciente;
import com.davidramos1010.sistema_dental.entity.Tratamiento;
import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.exception.RecursoNoEncontradoException;
import com.davidramos1010.sistema_dental.exception.ReglaNegocioException;
import com.davidramos1010.sistema_dental.notificacion.CitaNotificacionEvent;
import com.davidramos1010.sistema_dental.notificacion.TipoNotificacion;
import com.davidramos1010.sistema_dental.repository.CitaRepository;
import com.davidramos1010.sistema_dental.repository.DentistaRepository;
import com.davidramos1010.sistema_dental.repository.PacienteRepository;
import com.davidramos1010.sistema_dental.repository.TratamientoRepository;
import com.davidramos1010.sistema_dental.security.UsuarioActual;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final PacienteRepository pacienteRepository;
    private final DentistaRepository dentistaRepository;
    private final TratamientoRepository tratamientoRepository;
    private final UsuarioActual usuarioActual;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public PageResponse<CitaResponse> listar(EstadoCita estado, LocalDate desde, LocalDate hasta,
                                             Long dentistaId, Long pacienteId, String q, Pageable pageable) {
        Usuario u = usuarioActual.obtener();
        String rol = u.getRol().getNombre();

        // El rol limita lo que se ve: ignora los filtros de otro dentista o paciente
        if ("PACIENTE".equals(rol)) {
            pacienteId = pacienteRepository.findByUsuarioId(u.getId()).map(Paciente::getId).orElse(-1L);
        } else if ("DENTISTA".equals(rol)) {
            dentistaId = dentistaRepository.findByUsuarioId(u.getId()).map(Dentista::getId).orElse(-1L);
        }

        var inicio = desde == null ? null : desde.atStartOfDay();
        var fin = hasta == null ? null : hasta.plusDays(1).atStartOfDay();

        return PageResponse.from(
                citaRepository.buscar(estado, inicio, fin, dentistaId, pacienteId,
                        TratamientoService.normalizar(q), pageable).map(this::aResponse));
    }

    @Transactional(readOnly = true)
    public CitaResponse obtener(Long id) {
        return aResponse(obtenerPermitida(id, usuarioActual.obtener()));
    }

    @Transactional
    public CitaResponse crear(CitaRequest req) {
        Usuario u = usuarioActual.obtener();
        String rol = u.getRol().getNombre();

        Paciente paciente;
        if ("PACIENTE".equals(rol)) {
            paciente = pacienteRepository.findByUsuarioId(u.getId())
                    .orElseThrow(() -> new ReglaNegocioException("No tienes perfil de paciente"));
        } else {
            if (req.pacienteId() == null) {
                throw new ReglaNegocioException("El paciente es obligatorio");
            }
            paciente = pacienteRepository.findById(req.pacienteId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Paciente no encontrado"));
        }

        Dentista dentista;
        if ("DENTISTA".equals(rol)) {
            dentista = dentistaRepository.findByUsuarioId(u.getId())
                    .orElseThrow(() -> new ReglaNegocioException("No tienes perfil de dentista"));
        } else {
            dentista = dentistaRepository.findById(req.dentistaId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Dentista no encontrado"));
        }

        if (!paciente.getUsuario().isActivo() || !dentista.getUsuario().isActivo()) {
            throw new ReglaNegocioException("El paciente o el dentista están desactivados");
        }
        if (citaRepository.existsByDentistaIdAndFechaHoraAndEstadoNot(
                dentista.getId(), req.fechaHora(), EstadoCita.CANCELADA)) {
            throw new ReglaNegocioException("El dentista ya tiene una cita a esa hora");
        }

        Cita c = new Cita();
        c.setPaciente(paciente);
        c.setDentista(dentista);
        c.setFechaHora(req.fechaHora());
        c.setMotivo(req.motivo().trim());
        c.setNotas(req.notas());
        c.setEstado(EstadoCita.PROGRAMADA);
        c.getTratamientos().addAll(resolverTratamientos(req.tratamientoIds()));
        citaRepository.save(c);

        notificar(c, TipoNotificacion.CREADA);
        return aResponse(c);
    }

    @Transactional
    public CitaResponse actualizar(Long id, CitaRequest req) {
        Usuario u = usuarioActual.obtener();
        String rol = u.getRol().getNombre();
        Cita c = obtenerPermitida(id, u);

        if (c.getEstado() == EstadoCita.COMPLETADA || c.getEstado() == EstadoCita.CANCELADA) {
            throw new ReglaNegocioException("No se puede modificar una cita " + c.getEstado().name().toLowerCase());
        }

        // Solo el ADMIN puede reasignar la cita a otro dentista
        if ("ADMIN".equals(rol) && !req.dentistaId().equals(c.getDentista().getId())) {
            c.setDentista(dentistaRepository.findById(req.dentistaId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Dentista no encontrado")));
        }

        if (citaRepository.existsByDentistaIdAndFechaHoraAndEstadoNotAndIdNot(
                c.getDentista().getId(), req.fechaHora(), EstadoCita.CANCELADA, c.getId())) {
            throw new ReglaNegocioException("El dentista ya tiene una cita a esa hora");
        }

        boolean cambioFecha = !c.getFechaHora().equals(req.fechaHora());
        c.setFechaHora(req.fechaHora());
        c.setMotivo(req.motivo().trim());
        c.setNotas(req.notas());
        c.getTratamientos().clear();
        c.getTratamientos().addAll(resolverTratamientos(req.tratamientoIds()));

        if (cambioFecha) {
            notificar(c, TipoNotificacion.REPROGRAMADA);
        }
        return aResponse(c);
    }

    @Transactional
    public CitaResponse cambiarEstado(Long id, EstadoCita nuevo) {
        Usuario u = usuarioActual.obtener();
        Cita c = obtenerPermitida(id, u);

        if ("PACIENTE".equals(u.getRol().getNombre()) && nuevo != EstadoCita.CANCELADA) {
            throw new AccessDeniedException("Solo puedes cancelar tus citas");
        }
        if (c.getEstado() == EstadoCita.COMPLETADA || c.getEstado() == EstadoCita.CANCELADA) {
            throw new ReglaNegocioException(
                    "La cita ya está " + c.getEstado().name().toLowerCase() + " y no puede cambiar de estado");
        }
        c.setEstado(nuevo);

        if (nuevo == EstadoCita.CONFIRMADA) {
            notificar(c, TipoNotificacion.CONFIRMADA);
        } else if (nuevo == EstadoCita.CANCELADA) {
            notificar(c, TipoNotificacion.CANCELADA);
        }
        return aResponse(c);
    }

    @Transactional
    public void eliminar(Long id) {
        Cita c = citaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada"));
        citaRepository.delete(c);
    }

    // ---------- auxiliares ----------

    private void notificar(Cita c, TipoNotificacion tipo) {
        Usuario paciente = c.getPaciente().getUsuario();
        eventPublisher.publishEvent(new CitaNotificacionEvent(
                tipo,
                paciente.getNombre(),
                paciente.getEmail(),
                paciente.getTelefono(),
                c.getDentista().getUsuario().getNombre(),
                c.getFechaHora(),
                c.getMotivo()));
    }

    private Cita obtenerPermitida(Long id, Usuario u) {
        Cita c = citaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Cita no encontrada"));

        boolean permitido = switch (u.getRol().getNombre()) {
            case "ADMIN" -> true;
            case "DENTISTA" -> c.getDentista().getUsuario().getId().equals(u.getId());
            case "PACIENTE" -> c.getPaciente().getUsuario().getId().equals(u.getId());
            default -> false;
        };
        if (!permitido) {
            // 404 y no 403, para no revelar que la cita existe
            throw new RecursoNoEncontradoException("Cita no encontrada");
        }
        return c;
    }

    private Set<Tratamiento> resolverTratamientos(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }
        List<Tratamiento> lista = tratamientoRepository.findAllById(ids);
        if (lista.size() != ids.size()) {
            throw new RecursoNoEncontradoException("Alguno de los tratamientos no existe");
        }
        if (lista.stream().anyMatch(t -> !t.isActivo())) {
            throw new ReglaNegocioException("Alguno de los tratamientos está desactivado");
        }
        return new HashSet<>(lista);
    }

    private CitaResponse aResponse(Cita c) {
        List<TratamientoResponse> tratamientos = c.getTratamientos().stream()
                .sorted(Comparator.comparing(Tratamiento::getNombre))
                .map(TratamientoService::aResponse)
                .toList();
        BigDecimal total = tratamientos.stream()
                .map(TratamientoResponse::precio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CitaResponse(c.getId(),
                c.getPaciente().getId(), c.getPaciente().getUsuario().getNombre(),
                c.getDentista().getId(), c.getDentista().getUsuario().getNombre(),
                c.getDentista().getEspecialidad().getNombre(),
                c.getFechaHora(), c.getEstado(), c.getMotivo(), c.getNotas(), tratamientos, total);
    }
}