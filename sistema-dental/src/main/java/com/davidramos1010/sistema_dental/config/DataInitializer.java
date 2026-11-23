package com.davidramos1010.sistema_dental.config;

import com.davidramos1010.sistema_dental.entity.Usuario;
import com.davidramos1010.sistema_dental.repository.RolRepository;
import com.davidramos1010.sistema_dental.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        crear("Administrador", "admin@sistemadental.com", "Admin#2026", "ADMIN");
        crear("Dentista Demo", "dentista@sistemadental.com", "Dentista#2026", "DENTISTA");
        crear("Paciente Demo", "paciente@sistemadental.com", "Paciente#2026", "PACIENTE");
    }

    private void crear(String nombre, String email, String pass, String rol) {
        if (usuarioRepository.existsByEmail(email)) {
            return;
        }
        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(pass));
        u.setRol(rolRepository.findByNombre(rol).orElseThrow());
        usuarioRepository.save(u);
    }
}