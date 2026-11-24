package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Paciente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    @EntityGraph(attributePaths = "usuario")
    Optional<Paciente> findByUsuarioId(Long usuarioId);

    @EntityGraph(attributePaths = "usuario")
    @Override
    Optional<Paciente> findById(Long id);

    @EntityGraph(attributePaths = "usuario")
    @Query(value = """
            select p from Paciente p join p.usuario u
            where u.activo = true
              and (:q is null or lower(u.nombre) like lower(concat('%', :q, '%'))
                              or lower(u.email) like lower(concat('%', :q, '%')))
            """,
            countQuery = """
            select count(p) from Paciente p join p.usuario u
            where u.activo = true
              and (:q is null or lower(u.nombre) like lower(concat('%', :q, '%'))
                              or lower(u.email) like lower(concat('%', :q, '%')))
            """)
    Page<Paciente> buscar(@Param("q") String q, Pageable pageable);
}