package com.davidramos1010.sistema_dental.repository;

import com.davidramos1010.sistema_dental.entity.Tratamiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TratamientoRepository extends JpaRepository<Tratamiento, Long> {

    @Query(value = """
            select t from Tratamiento t
            where (:q is null or lower(t.nombre) like lower(concat('%', :q, '%')))
              and (:activo is null or t.activo = :activo)
            """,
            countQuery = """
            select count(t) from Tratamiento t
            where (:q is null or lower(t.nombre) like lower(concat('%', :q, '%')))
              and (:activo is null or t.activo = :activo)
            """)
    Page<Tratamiento> buscar(@Param("q") String q, @Param("activo") Boolean activo, Pageable pageable);
}