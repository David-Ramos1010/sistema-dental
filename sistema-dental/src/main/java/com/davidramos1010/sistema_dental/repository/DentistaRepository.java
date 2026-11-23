package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Dentista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DentistaRepository extends JpaRepository<Dentista, Long> {
    Optional<Dentista> findByUsuarioId(Long usuarioId);
}