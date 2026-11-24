package com.davidramos1010.sistema_dental.security;

import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.exception.RecursoNoEncontradoException;
import com.davidramos1010.sistema_dental.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsuarioActual {

    private final UsuarioRepository usuarioRepository;

    public Usuario obtener() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }
}