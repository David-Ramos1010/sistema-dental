las dependencias utilizadas para nuestro proyecto son:

Spring Web           -> la dependencia encargada de crear la API REST.
Spring Data JPA      -> la dependencia encargada de dar acceso a la base de datos con entidades y repositorios.
Spring Security      -> la dependencia encargada de la autenticación, autorización por rol y cifrado de contraseñas con BCrypt.
Validation           -> la dependencia encargada de las notaciones en los DTOs.
MySQL Driver         -> la dependencia encargada de conectarse a MySQL.
Flyway Migration     -> la dependencia encargada de crear y versionar las tablas con scripts de migración.
Java Mail Sender     -> la dependencia encargada del envío de correos mediante Postfix.
Lombok               -> la dependencia encargada de evitar construir los getters, setters y constructores
Spring Boot DevTools -> la dependencia encargada del reinicio automático al guardar cambios durante el desarrollo.
JJWT API             -> la dependencia encargada de la interfaz para crear y validar tokens JWT.
JJWT Impl            -> la dependencia encargada de la implementación interna de JJWT.
JJWT Jackson         -> la dependencia encargada de serializar el contenido del token JWT con Jackson.
Twilio               -> la dependencia encargada del SDK para enviar SMS y mensajes de WhatsApp.
Flyway MySQL         -> la dependencia encargada del módulo de Flyway necesario para trabajar con MySQL.