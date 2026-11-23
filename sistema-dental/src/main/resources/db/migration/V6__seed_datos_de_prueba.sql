-- Especialidades 
INSERT INTO especialidades (nombre) VALUES
('Odontología general'), ('Ortodoncia'), ('Endodoncia'), ('Periodoncia'),
('Odontopediatría'), ('Cirugía maxilofacial'), ('Implantología'),
('Prostodoncia'), ('Estética dental'), ('Radiología oral');

-- Tratamientos
INSERT INTO tratamientos (nombre, descripcion, precio, duracion_min) VALUES
('Limpieza dental', 'Profilaxis y remoción de sarro', 600.00, 45),
('Consulta de valoración', 'Revisión general y diagnóstico', 350.00, 30),
('Resina dental', 'Restauración de caries con resina', 900.00, 60),
('Extracción simple', 'Extracción de pieza dental sin complicaciones', 800.00, 40),
('Endodoncia', 'Tratamiento de conductos', 3500.00, 90),
('Blanqueamiento dental', 'Aclarado dental en consultorio', 2800.00, 75),
('Corona dental', 'Corona de porcelana sobre metal', 4500.00, 60),
('Ortodoncia (revisión)', 'Ajuste mensual de brackets', 700.00, 30),
('Implante dental', 'Colocación de implante de titanio', 12000.00, 120),
('Radiografía panorámica', 'Estudio radiológico completo', 500.00, 20),
('Selladores de fosetas', 'Prevención de caries en niños', 450.00, 30),
('Tratamiento periodontal', 'Raspado y alisado radicular', 1800.00, 60);

-- Usuarios
-- INSERT IGNORE
INSERT IGNORE INTO usuarios (nombre, email, password, telefono, rol_id) VALUES
('Administrador', 'admin@sistemadental.com', '$2b$10$rbvDPp1QxMS7aFl4V9L7bOwrG.Cx85TSx4TnGBP6Hg5owW2tFkumG', '+5219511000000', (SELECT id FROM roles WHERE nombre = 'ADMIN')),

('Dentista Demo', 'dentista@sistemadental.com', '$2b$10$c7kQSzapm.0adgND9Fyj1OGqoaTZPD.MrruKWNZMg9WXEid/CYeMa', '+5219511000001', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dra. Laura Méndez', 'laura.mendez@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000002', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dr. Carlos Ruiz', 'carlos.ruiz@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000003', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dra. Sofía Herrera', 'sofia.herrera@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000004', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dr. Miguel Torres', 'miguel.torres@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000005', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dra. Valeria Ortiz', 'valeria.ortiz@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000006', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dr. Jorge Castillo', 'jorge.castillo@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000007', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dra. Patricia Luna', 'patricia.luna@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000008', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dr. Roberto Vargas', 'roberto.vargas@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000009', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),
('Dra. Camila Reyes', 'camila.reyes@sistemadental.com', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000010', (SELECT id FROM roles WHERE nombre = 'DENTISTA')),

('Paciente Demo', 'paciente@sistemadental.com', '$2b$10$REld6bWoBxHQr0Q6bNvIJeev8e5KWbFge.5gfRznhiZy8oJTR3Jtm', '+5219511000011', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('María García', 'maria.garcia@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000012', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Luis Hernández', 'luis.hernandez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000013', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Elena Martínez', 'elena.martinez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000014', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Pedro Sánchez', 'pedro.sanchez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000015', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Lucía Ramírez', 'lucia.ramirez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000016', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Fernando López', 'fernando.lopez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000017', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Gabriela Flores', 'gabriela.flores@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000018', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Diego Morales', 'diego.morales@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000019', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Isabel Cruz', 'isabel.cruz@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000020', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Andrés Jiménez', 'andres.jimenez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000021', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Daniela Ríos', 'daniela.rios@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000022', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Ricardo Pérez', 'ricardo.perez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000023', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Mariana Gómez', 'mariana.gomez@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000024', (SELECT id FROM roles WHERE nombre = 'PACIENTE')),
('Héctor Aguilar', 'hector.aguilar@correo.test', '$2b$10$R6PDvR61zAk4rIJnG6RyRunjKC2oO6D8MPCJlulb9snTpJIDeTnRi', '+5219511000025', (SELECT id FROM roles WHERE nombre = 'PACIENTE'));

-- Perfiles de dentistas 
INSERT INTO dentistas (usuario_id, especialidad_id, cedula)
SELECT u.id, e.id, v.cedula
FROM (
    SELECT 'dentista@sistemadental.com' AS email, 'Odontología general' AS esp, 'CED-1000001' AS cedula
    UNION ALL SELECT 'laura.mendez@sistemadental.com', 'Ortodoncia', 'CED-1000002'
    UNION ALL SELECT 'carlos.ruiz@sistemadental.com', 'Endodoncia', 'CED-1000003'
    UNION ALL SELECT 'sofia.herrera@sistemadental.com', 'Periodoncia', 'CED-1000004'
    UNION ALL SELECT 'miguel.torres@sistemadental.com', 'Odontopediatría', 'CED-1000005'
    UNION ALL SELECT 'valeria.ortiz@sistemadental.com', 'Cirugía maxilofacial', 'CED-1000006'
    UNION ALL SELECT 'jorge.castillo@sistemadental.com', 'Implantología', 'CED-1000007'
    UNION ALL SELECT 'patricia.luna@sistemadental.com', 'Prostodoncia', 'CED-1000008'
    UNION ALL SELECT 'roberto.vargas@sistemadental.com', 'Estética dental', 'CED-1000009'
    UNION ALL SELECT 'camila.reyes@sistemadental.com', 'Radiología oral', 'CED-1000010'
) v
JOIN usuarios u ON u.email = v.email
JOIN especialidades e ON e.nombre = v.esp;

-- Perfiles de pacientes
INSERT INTO pacientes (usuario_id, fecha_nacimiento, direccion, notas_medicas)
SELECT u.id, v.nacimiento, v.direccion, v.notas
FROM (
    SELECT 'paciente@sistemadental.com' AS email, DATE '1995-03-14' AS nacimiento, 'Calle Hidalgo 101, Oaxaca de Juárez' AS direccion, 'Sin observaciones' AS notas
    UNION ALL SELECT 'maria.garcia@correo.test', DATE '1988-07-02', 'Av. Universidad 450, Oaxaca de Juárez', 'Sensibilidad al frío'
    UNION ALL SELECT 'luis.hernandez@correo.test', DATE '1979-11-23', 'Calle Morelos 22, Santa Cruz Xoxocotlán', 'Sin observaciones'
    UNION ALL SELECT 'elena.martinez@correo.test', DATE '2001-01-30', 'Privada Los Pinos 8, Oaxaca de Juárez', 'Usa ortodoncia'
    UNION ALL SELECT 'pedro.sanchez@correo.test', DATE '1969-09-12', 'Calle Allende 310, Tlalixtac de Cabrera', 'Hipertensión controlada'
    UNION ALL SELECT 'lucia.ramirez@correo.test', DATE '1993-05-19', 'Av. Ferrocarril 77, Oaxaca de Juárez', 'Sin observaciones'
    UNION ALL SELECT 'fernando.lopez@correo.test', DATE '1984-12-03', 'Calle Juárez 15, San Agustín de las Juntas', 'Sin observaciones'
    UNION ALL SELECT 'gabriela.flores@correo.test', DATE '1998-08-27', 'Calle Reforma 64, Oaxaca de Juárez', 'Embarazo (segundo trimestre)'
    UNION ALL SELECT 'diego.morales@correo.test', DATE '2012-04-09', 'Av. Símbolos Patrios 120, Oaxaca de Juárez', 'Paciente pediátrico'
    UNION ALL SELECT 'isabel.cruz@correo.test', DATE '1975-02-16', 'Calle Hidalgo 340, Santa Cruz Xoxocotlán', 'Sin observaciones'
    UNION ALL SELECT 'andres.jimenez@correo.test', DATE '1990-10-05', 'Calle Cinco Señores 5, Oaxaca de Juárez', 'Bruxismo'
    UNION ALL SELECT 'daniela.rios@correo.test', DATE '2004-06-21', 'Av. Lázaro Cárdenas 90, Oaxaca de Juárez', 'Sin observaciones'
    UNION ALL SELECT 'ricardo.perez@correo.test', DATE '1982-03-08', 'Calle Independencia 200, Santa Cruz Xoxocotlán', 'Sin observaciones'
    UNION ALL SELECT 'mariana.gomez@correo.test', DATE '1996-11-14', 'Calle Murguía 18, Oaxaca de Juárez', 'Sin observaciones'
    UNION ALL SELECT 'hector.aguilar@correo.test', DATE '1971-07-30', 'Calle Abasolo 55, San Sebastián Tutla', 'Diabetes tipo 2'
) v
JOIN usuarios u ON u.email = v.email;

-- Citas 
INSERT INTO citas (paciente_id, dentista_id, fecha_hora, estado, motivo, notas)
SELECT p.id, d.id, v.fecha, v.estado, v.motivo, v.notas
FROM (
    SELECT 'paciente@sistemadental.com' AS paciente, 'dentista@sistemadental.com' AS dentista, '2026-11-10 09:00:00' AS fecha, 'COMPLETADA' AS estado, 'Revisión general' AS motivo, 'Se recomienda limpieza' AS notas
    UNION ALL SELECT 'paciente@sistemadental.com', 'dentista@sistemadental.com', '2026-12-02 10:00:00', 'CONFIRMADA', 'Limpieza dental', NULL
    UNION ALL SELECT 'maria.garcia@correo.test', 'laura.mendez@sistemadental.com', '2026-11-12 11:00:00', 'COMPLETADA', 'Control de brackets', 'Ajuste realizado'
    UNION ALL SELECT 'luis.hernandez@correo.test', 'carlos.ruiz@sistemadental.com', '2026-12-03 16:00:00', 'PROGRAMADA', 'Dolor en molar inferior', NULL
    UNION ALL SELECT 'elena.martinez@correo.test', 'laura.mendez@sistemadental.com', '2026-12-04 12:00:00', 'CONFIRMADA', 'Revisión de ortodoncia', NULL
    UNION ALL SELECT 'pedro.sanchez@correo.test', 'sofia.herrera@sistemadental.com', '2026-12-05 09:30:00', 'PROGRAMADA', 'Sangrado de encías', NULL
    UNION ALL SELECT 'lucia.ramirez@correo.test', 'roberto.vargas@sistemadental.com', '2026-12-07 17:00:00', 'PROGRAMADA', 'Blanqueamiento', NULL
    UNION ALL SELECT 'fernando.lopez@correo.test', 'jorge.castillo@sistemadental.com', '2026-11-18 13:00:00', 'CANCELADA', 'Valoración de implante', 'El paciente canceló'
    UNION ALL SELECT 'gabriela.flores@correo.test', 'dentista@sistemadental.com', '2026-12-08 10:30:00', 'CONFIRMADA', 'Limpieza y revisión', NULL
    UNION ALL SELECT 'diego.morales@correo.test', 'miguel.torres@sistemadental.com', '2026-12-09 15:00:00', 'PROGRAMADA', 'Selladores', NULL
    UNION ALL SELECT 'isabel.cruz@correo.test', 'patricia.luna@sistemadental.com', '2026-11-20 12:00:00', 'COMPLETADA', 'Corona dental', 'Corona colocada'
    UNION ALL SELECT 'andres.jimenez@correo.test', 'carlos.ruiz@sistemadental.com', '2026-12-10 11:30:00', 'PROGRAMADA', 'Endodoncia', NULL
    UNION ALL SELECT 'daniela.rios@correo.test', 'camila.reyes@sistemadental.com', '2026-12-11 09:00:00', 'CONFIRMADA', 'Radiografía panorámica', NULL
    UNION ALL SELECT 'ricardo.perez@correo.test', 'valeria.ortiz@sistemadental.com', '2026-12-12 14:00:00', 'PROGRAMADA', 'Extracción de muela del juicio', NULL
    UNION ALL SELECT 'mariana.gomez@correo.test', 'dentista@sistemadental.com', '2026-11-16 08:30:00', 'COMPLETADA', 'Resina en premolar', NULL
) v
JOIN usuarios up ON up.email = v.paciente
JOIN pacientes p ON p.usuario_id = up.id
JOIN usuarios ud ON ud.email = v.dentista
JOIN dentistas d ON d.usuario_id = ud.id;

-- Tratamientos por cita 
INSERT INTO cita_tratamiento (cita_id, tratamiento_id)
SELECT c.id, t.id
FROM (
    SELECT 'paciente@sistemadental.com' AS paciente, '2026-11-10 09:00:00' AS fecha, 'Consulta de valoración' AS tratamiento
    UNION ALL SELECT 'paciente@sistemadental.com', '2026-12-02 10:00:00', 'Limpieza dental'
    UNION ALL SELECT 'paciente@sistemadental.com', '2026-12-02 10:00:00', 'Radiografía panorámica'
    UNION ALL SELECT 'maria.garcia@correo.test', '2026-11-12 11:00:00', 'Ortodoncia (revisión)'
    UNION ALL SELECT 'luis.hernandez@correo.test', '2026-12-03 16:00:00', 'Consulta de valoración'
    UNION ALL SELECT 'luis.hernandez@correo.test', '2026-12-03 16:00:00', 'Endodoncia'
    UNION ALL SELECT 'elena.martinez@correo.test', '2026-12-04 12:00:00', 'Ortodoncia (revisión)'
    UNION ALL SELECT 'pedro.sanchez@correo.test', '2026-12-05 09:30:00', 'Tratamiento periodontal'
    UNION ALL SELECT 'lucia.ramirez@correo.test', '2026-12-07 17:00:00', 'Blanqueamiento dental'
    UNION ALL SELECT 'fernando.lopez@correo.test', '2026-11-18 13:00:00', 'Implante dental'
    UNION ALL SELECT 'gabriela.flores@correo.test', '2026-12-08 10:30:00', 'Limpieza dental'
    UNION ALL SELECT 'gabriela.flores@correo.test', '2026-12-08 10:30:00', 'Consulta de valoración'
    UNION ALL SELECT 'diego.morales@correo.test', '2026-12-09 15:00:00', 'Selladores de fosetas'
    UNION ALL SELECT 'isabel.cruz@correo.test', '2026-11-20 12:00:00', 'Corona dental'
    UNION ALL SELECT 'andres.jimenez@correo.test', '2026-12-10 11:30:00', 'Endodoncia'
    UNION ALL SELECT 'daniela.rios@correo.test', '2026-12-11 09:00:00', 'Radiografía panorámica'
    UNION ALL SELECT 'ricardo.perez@correo.test', '2026-12-12 14:00:00', 'Extracción simple'
    UNION ALL SELECT 'mariana.gomez@correo.test', '2026-11-16 08:30:00', 'Resina dental'
) v
JOIN usuarios u ON u.email = v.paciente
JOIN pacientes p ON p.usuario_id = u.id
JOIN citas c ON c.paciente_id = p.id AND c.fecha_hora = v.fecha
JOIN tratamientos t ON t.nombre = v.tratamiento;