package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.TokenRevocado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRevocadoRepository extends JpaRepository<TokenRevocado, Long> {
    boolean existsByJti(String jti);
}