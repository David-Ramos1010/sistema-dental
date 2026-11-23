package com.davidramos1010.sistema_dental.security;

import com.davidramos1010.sistema_dental.repository.TokenRevocadoRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenRevocadoRepository tokenRevocadoRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            String token = header.substring(7);

            if (jwtService.esValido(token)) {
                Claims claims = jwtService.extraerClaims(token);

                // Si el token fue revocado con logout, no se autentica
                boolean revocado = claims.getId() != null
                        && tokenRevocadoRepository.existsByJti(claims.getId());

                if (!revocado) {
                    try {
                        UserDetails ud = userDetailsService.loadUserByUsername(claims.getSubject());

                        if (ud.isEnabled()) {
                            var auth = new UsernamePasswordAuthenticationToken(ud, null, ud.getAuthorities());
                            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    } catch (UsernameNotFoundException ignored) {
                        // token válido pero el usuario ya no existe: se deja sin autenticar
                    }
                }
            }
        }
        chain.doFilter(req, res);
    }
}