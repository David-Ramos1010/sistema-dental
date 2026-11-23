package com.davidramos1010.sistema_dental.controller;

import com.davidramos1010.sistema_dental.dto.LoginRequest;
import com.davidramos1010.sistema_dental.dto.LoginResponse;
import com.davidramos1010.sistema_dental.dto.MensajeResponse;
import com.davidramos1010.sistema_dental.dto.OlvidePasswordRequest;
import com.davidramos1010.sistema_dental.dto.RegistroRequest;
import com.davidramos1010.sistema_dental.dto.RestablecerPasswordRequest;
import com.davidramos1010.sistema_dental.dto.UsuarioResponse;
import com.davidramos1010.sistema_dental.service.AuthService;
import com.davidramos1010.sistema_dental.service.RecuperacionPasswordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RecuperacionPasswordService recuperacionService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registro(@Valid @RequestBody RegistroRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrar(req));
    }

    @PostMapping("/logout")
    public MensajeResponse logout(@RequestHeader("Authorization") String authorization) {
        authService.logout(authorization);
        return new MensajeResponse("Sesión cerrada correctamente");
    }

    @PostMapping("/olvide-password")
    public MensajeResponse olvidePassword(@Valid @RequestBody OlvidePasswordRequest req) {
        recuperacionService.solicitar(req.email());
        return new MensajeResponse("Si el correo está registrado, recibirás un enlace para restablecer tu contraseña");
    }

    @PostMapping("/restablecer-password")
    public MensajeResponse restablecerPassword(@Valid @RequestBody RestablecerPasswordRequest req) {
        recuperacionService.restablecer(req.token(), req.nuevaPassword());
        return new MensajeResponse("Contraseña actualizada correctamente");
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        return Map.of(
                "email", auth.getName(),
                "roles", auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());
    }
}