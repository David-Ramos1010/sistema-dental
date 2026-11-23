package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.dto.LoginRequest;
import com.davidramos1010.sistema_dental.dto.LoginResponse;
import com.davidramos1010.sistema_dental.dto.RegistroRequest;
import com.davidramos1010.sistema_dental.dto.UsuarioResponse;
import com.davidramos1010.sistema_dental.entity.TokenRevocado;
import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.exception.ReglaNegocioException;
import com.davidramos1010.sistema_dental.repository.RolRepository;
import com.davidramos1010.sistema_dental.repository.TokenRevocadoRepository;
import com.davidramos1010.sistema_dental.repository.UsuarioRepository;
import com.davidramos1010.sistema_dental.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.davidramos1010.sistema_dental.entity.Paciente;
import com.davidramos1010.sistema_dental.repository.PacienteRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final TokenRevocadoRepository tokenRevocadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PacienteRepository pacienteRepository;

    public LoginResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        Usuario u = usuarioRepository.findByEmail(req.email()).orElseThrow();
        String token = jwtService.generarToken(u.getEmail(), u.getRol().getNombre());

        return new LoginResponse(token, "Bearer", u.getNombre(), u.getEmail(), u.getRol().getNombre());
    }

    @Transactional
    public UsuarioResponse registrar(RegistroRequest req) {
        String email = req.email().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new ReglaNegocioException("El correo ya está registrado");
        }

        Usuario u = new Usuario();
        u.setNombre(req.nombre().trim());
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(req.password()));
        u.setTelefono(req.telefono());
        u.setRol(rolRepository.findByNombre("PACIENTE").orElseThrow());
        usuarioRepository.save(u);
        Paciente paciente = new Paciente();
        paciente.setUsuario(u);
        pacienteRepository.save(paciente);

        return new UsuarioResponse(u.getId(), u.getNombre(), u.getEmail(), u.getTelefono(), "PACIENTE");
    }

    @Transactional
    public void logout(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return;
        }
        String token = authorizationHeader.substring(7);
        if (!jwtService.esValido(token)) {
            return;
        }

        Claims claims = jwtService.extraerClaims(token);
        if (claims.getId() != null && !tokenRevocadoRepository.existsByJti(claims.getId())) {
            TokenRevocado revocado = new TokenRevocado();
            revocado.setJti(claims.getId());
            revocado.setExpiraEn(claims.getExpiration().toInstant());
            tokenRevocadoRepository.save(revocado);
        }
    }
}