package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @EntityGraph(attributePaths = "rol") // carga el rol en la misma consulta
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);
}