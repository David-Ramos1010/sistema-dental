package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TratamientoRepository extends JpaRepository<Tratamiento, Long> {
}