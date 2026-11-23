package com.davidramos1010.sistema_dental.service;

import com.davidramos1010.sistema_dental.entity.TokenRecuperacion;
import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.exception.ReglaNegocioException;
import com.davidramos1010.sistema_dental.repository.TokenRecuperacionRepository;
import com.davidramos1010.sistema_dental.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecuperacionPasswordService {

    private static final Duration VIGENCIA = Duration.ofMinutes(30);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacionRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.dev.log-reset-link:false}")
    private boolean logResetLink;

    @Transactional
    public void solicitar(String email) {
        usuarioRepository.findByEmail(email.trim().toLowerCase())
                .filter(Usuario::isActivo)
                .ifPresent(u -> {
                    tokenRepository.invalidarPendientes(u.getId());

                    String token = generarToken();
                    TokenRecuperacion t = new TokenRecuperacion();
                    t.setUsuario(u);
                    t.setTokenHash(hash(token));
                    t.setExpiraEn(Instant.now().plus(VIGENCIA));
                    tokenRepository.save(t);

                    String enlace = frontendUrl + "/restablecer-password?token=" + token;
                    if (logResetLink) {
                        log.info("[DEV] Enlace de recuperación para {}: {}", u.getEmail(), enlace);
                    }
                    emailService.enviarRecuperacion(u.getEmail(), u.getNombre(), enlace);
                });
    }

    @Transactional
    public void restablecer(String token, String nuevaPassword) {
        TokenRecuperacion t = tokenRepository.findByTokenHash(hash(token))
                .filter(x -> !x.isUsado() && x.getExpiraEn().isAfter(Instant.now()))
                .orElseThrow(() -> new ReglaNegocioException("El enlace es inválido o ya expiró"));

        t.getUsuario().setPassword(passwordEncoder.encode(nuevaPassword));
        t.setUsado(true);
    }

    private static String generarToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String hash(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}