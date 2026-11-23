CREATE TABLE especialidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE dentistas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    especialidad_id BIGINT NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    CONSTRAINT fk_dentistas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_dentistas_especialidad FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
) ENGINE=InnoDB;

CREATE TABLE pacientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE,
    fecha_nacimiento DATE NULL,
    direccion VARCHAR(200),
    notas_medicas VARCHAR(500),
    CONSTRAINT fk_pacientes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE tratamientos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(300),
    precio DECIMAL(10,2) NOT NULL,
    duracion_min INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    dentista_id BIGINT NOT NULL,
    fecha_hora DATETIME(6) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADA',
    motivo VARCHAR(200) NOT NULL,
    notas VARCHAR(500),
    creado_en DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_citas_dentista FOREIGN KEY (dentista_id) REFERENCES dentistas(id),
    INDEX idx_citas_fecha (fecha_hora),
    INDEX idx_citas_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE cita_tratamiento (
    cita_id BIGINT NOT NULL,
    tratamiento_id BIGINT NOT NULL,
    PRIMARY KEY (cita_id, tratamiento_id),
    CONSTRAINT fk_ct_cita FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE CASCADE,
    CONSTRAINT fk_ct_tratamiento FOREIGN KEY (tratamiento_id) REFERENCES tratamientos(id)
) ENGINE=InnoDB;