CREATE TABLE tokens_recuperacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expira_en DATETIME(6) NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en DATETIME(6) NOT NULL,
    CONSTRAINT fk_recuperacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;