package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitaRepository extends JpaRepository<Cita, Long> {
}