# sistema-dental – Colección Bruno (v2)

Colección de pruebas para la API del sistema dental (`http://localhost:8089`).

## Cómo usarla

1. Abre la carpeta en Bruno (*Open Collection*).
2. Selecciona el entorno **local** (`environments/local.yml`). Ahí se cambia `baseUrl` y las credenciales del admin.
3. Ejecuta toda la colección con el **Runner** (clic derecho sobre la colección → *Run*), o por CLI:

```bash
bru run --env local
```

Las carpetas están numeradas y deben correrse **en orden**: las siguientes reutilizan los tokens que guardan las primeras.

## Contenido

| Carpeta | Qué prueba |
|---|---|
| 01 Autenticación | Registro de paciente (correo dinámico), login paciente y login admin. Cada login guarda el JWT en `pacienteToken` / `adminToken`. |
| 02 Rutas protegidas | `GET /auth/me`, listar y crear citas (token paciente), ruta `/prueba/admin` y crear dentista (token admin). |
| 03 Casos de error | Contraseña incorrecta (401), email nulo (400), sin token, token inválido, paciente en ruta admin (403), email duplicado, contraseña débil (400). |
| 04 Recuperación | Solicitar recuperación y restablecer con token inválido (error). |
| 05 Cerrar sesión | Logout y verificación de que el token revocado ya no sirve. |

## Notas

- Los tokens se guardan solo en variables de ejecución (`bru.setVar`); **no hay JWT escritos a mano** en los archivos.
- Los datos (correo del paciente, cédula, fecha de cita) se generan en cada corrida para poder repetir la colección sin choques.
- Credenciales del admin esperadas: `admin@sistemadental.com` / `Admin#2026` (editables en el entorno).
- El token revocado tras el logout asume que el backend invalida el `jti` del JWT.
