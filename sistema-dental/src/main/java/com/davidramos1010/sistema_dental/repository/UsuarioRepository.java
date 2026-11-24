package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @EntityGraph(attributePaths = "rol") 
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = "rol")
    @Query(value = """
            select u from Usuario u
            where (:q is null or lower(u.nombre) like lower(concat('%', :q, '%'))
                              or lower(u.email) like lower(concat('%', :q, '%')))
              and (:rol is null or u.rol.nombre = :rol)
              and (:activo is null or u.activo = :activo)
            """,
            countQuery = """
            select count(u) from Usuario u
            where (:q is null or lower(u.nombre) like lower(concat('%', :q, '%'))
                              or lower(u.email) like lower(concat('%', :q, '%')))
              and (:rol is null or u.rol.nombre = :rol)
              and (:activo is null or u.activo = :activo)
            """)
    Page<Usuario> buscar(@Param("q") String q, @Param("rol") String rol,
                         @Param("activo") Boolean activo, Pageable pageable);
}