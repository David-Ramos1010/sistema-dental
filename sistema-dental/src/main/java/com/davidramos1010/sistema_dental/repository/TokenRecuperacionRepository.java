package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.TokenRecuperacion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Long> {

    @EntityGraph(attributePaths = "usuario")
    Optional<TokenRecuperacion> findByTokenHash(String tokenHash);

    @Modifying
    @Query("update TokenRecuperacion t set t.usado = true where t.usuario.id = :usuarioId and t.usado = false")
    void invalidarPendientes(@Param("usuarioId") Long usuarioId);
}