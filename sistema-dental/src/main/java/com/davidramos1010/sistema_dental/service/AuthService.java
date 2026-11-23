package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.dto.LoginRequest;
import com.davidramos1010.sistema_dental.dto.LoginResponse;
import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.repository.UsuarioRepository;
import com.davidramos1010.sistema_dental.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        Usuario u = usuarioRepository.findByEmail(req.email()).orElseThrow();
        String token = jwtService.generarToken(u.getEmail(), u.getRol().getNombre());

        return new LoginResponse(token, "Bearer", u.getNombre(), u.getEmail(), u.getRol().getNombre());
    }
}