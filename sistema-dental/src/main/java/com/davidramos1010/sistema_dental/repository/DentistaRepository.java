package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Dentista;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DentistaRepository extends JpaRepository<Dentista, Long> {

    @EntityGraph(attributePaths = {"usuario", "especialidad"})
    Optional<Dentista> findByUsuarioId(Long usuarioId);

    @EntityGraph(attributePaths = {"usuario", "especialidad"})
    @Override
    Optional<Dentista> findById(Long id);

    boolean existsByCedula(String cedula);

    @EntityGraph(attributePaths = {"usuario", "especialidad"})
    @Query(value = """
            select d from Dentista d join d.usuario u join d.especialidad e
            where u.activo = true
              and (:q is null or lower(u.nombre) like lower(concat('%', :q, '%')))
              and (:especialidadId is null or e.id = :especialidadId)
            """,
            countQuery = """
            select count(d) from Dentista d join d.usuario u join d.especialidad e
            where u.activo = true
              and (:q is null or lower(u.nombre) like lower(concat('%', :q, '%')))
              and (:especialidadId is null or e.id = :especialidadId)
            """)
    Page<Dentista> buscar(@Param("q") String q, @Param("especialidadId") Long especialidadId, Pageable pageable);
}