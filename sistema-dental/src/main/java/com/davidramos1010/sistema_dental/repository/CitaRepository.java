package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Cita;
import com.davidramos1010.sistema_dental.entity.EstadoCita;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    @EntityGraph(attributePaths = {"paciente.usuario", "dentista.usuario", "dentista.especialidad"})
    @Override
    Optional<Cita> findById(Long id);

    boolean existsByDentistaIdAndFechaHoraAndEstadoNot(Long dentistaId, LocalDateTime fechaHora, EstadoCita estado);

    boolean existsByDentistaIdAndFechaHoraAndEstadoNotAndIdNot(Long dentistaId, LocalDateTime fechaHora,
                                                               EstadoCita estado, Long id);

    @EntityGraph(attributePaths = {"paciente.usuario", "dentista.usuario", "dentista.especialidad"})
    @Query(value = """
            select c from Cita c
              join c.paciente p join p.usuario pu
              join c.dentista d join d.usuario du
            where (:estado is null or c.estado = :estado)
              and (:desde is null or c.fechaHora >= :desde)
              and (:hasta is null or c.fechaHora < :hasta)
              and (:dentistaId is null or d.id = :dentistaId)
              and (:pacienteId is null or p.id = :pacienteId)
              and (:q is null or lower(pu.nombre) like lower(concat('%', :q, '%'))
                              or lower(du.nombre) like lower(concat('%', :q, '%'))
                              or lower(c.motivo) like lower(concat('%', :q, '%')))
            """,
            countQuery = """
            select count(c) from Cita c
              join c.paciente p join p.usuario pu
              join c.dentista d join d.usuario du
            where (:estado is null or c.estado = :estado)
              and (:desde is null or c.fechaHora >= :desde)
              and (:hasta is null or c.fechaHora < :hasta)
              and (:dentistaId is null or d.id = :dentistaId)
              and (:pacienteId is null or p.id = :pacienteId)
              and (:q is null or lower(pu.nombre) like lower(concat('%', :q, '%'))
                              or lower(du.nombre) like lower(concat('%', :q, '%'))
                              or lower(c.motivo) like lower(concat('%', :q, '%')))
            """)
    Page<Cita> buscar(@Param("estado") EstadoCita estado,
                      @Param("desde") LocalDateTime desde,
                      @Param("hasta") LocalDateTime hasta,
                      @Param("dentistaId") Long dentistaId,
                      @Param("pacienteId") Long pacienteId,
                      @Param("q") String q,
                      Pageable pageable);
}