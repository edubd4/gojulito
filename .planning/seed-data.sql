-- =============================================================================
-- GoJulito — Seed Data: Carga inicial VISAS 2026
-- Generated: 2026-04-11
-- Total: 69 clientes, 68 visas, ~80+ pagos
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. GRUPOS FAMILIARES
-- =============================================================================

INSERT INTO grupos_familiares (id, nombre) VALUES
  (gen_random_uuid(), 'Facundo Ortega y Emilce Lopez'),
  (gen_random_uuid(), 'Familia Costilla'),
  (gen_random_uuid(), 'Familia Juarez-Iñigo'),
  (gen_random_uuid(), 'Benjamin Amado y Cristina Riquelme'),
  (gen_random_uuid(), 'Ezequiel Pedacci y Mariano Colomo'),
  (gen_random_uuid(), 'Leticia Gimenez e Ignacio Celerino'),
  (gen_random_uuid(), 'Sofia Farias e Ignacio Zerda'),
  (gen_random_uuid(), 'Braian Aguirre, Mara Aybar y Ernesto Avalo'),
  (gen_random_uuid(), 'Facundo Colin Elias y Novia'),
  (gen_random_uuid(), 'Agustin Moreno y Novia'),
  (gen_random_uuid(), 'Paz Merlina y Sebastian Lopez Noir'),
  (gen_random_uuid(), 'Familia Enria'),
  (gen_random_uuid(), 'Familia Zamora Beltran'),
  (gen_random_uuid(), 'Gonzalo Barilari y Amigo'),
  (gen_random_uuid(), 'Bernabe Gonzalez y Maria Teresa'),
  (gen_random_uuid(), 'Daniel Fiat e Hija');

-- =============================================================================
-- 2. CLIENTES
-- =============================================================================

-- GJ-0001: Maria Abboud — PROSPECTO, sin datos
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0001', 'Maria Abboud', NULL, NULL, NULL, NULL, 'WHATSAPP', 'PROSPECTO', NULL, NULL, NULL);

-- GJ-0002: Facundo Ortega (grupo con Emilce)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0002', 'Facundo Ortega', '3816238289', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Facundo Ortega y Emilce Lopez'));

-- GJ-0003: Emilce Agustina Lopez (grupo con Facundo)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0003', 'Emilce Agustina Lopez', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Facundo Ortega y Emilce Lopez'));

-- GJ-0004: Matias Serrano Gramajo
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0004', 'Matias Serrano Gramajo', '3814474829', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0005: Simon Tobias Costilla (grupo Familia Costilla)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0005', 'Simon Tobias Costilla', '3813009060', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Descuento por sumar 2 amigos', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Costilla'));

-- GJ-0006: Costilla Carlos David (grupo Familia Costilla)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0006', 'Costilla Carlos David', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Costilla'));

-- GJ-0007: Javier Agustin Hernandez
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0007', 'Javier Agustin Hernandez', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0008: Matias Ruiz
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0008', 'Matias Ruiz', '3517628984', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0009: Martina Diaz
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0009', 'Martina Diaz', '3816217421', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0010: Samir Zehid
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0010', 'Samir Zehid', '2254612106', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0011: Camila Nair Amado
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0011', 'Camila Nair Amado', '2974099374', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0012: Gonzalo Tabares
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0012', 'Gonzalo Tabares', '3814457952', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0013: Gaspar Jauregui
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0013', 'Gaspar Jauregui', '1136997498', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0014: Josefina Jara
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0014', 'Josefina Jara', '3816555315', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0015: Muhammad Younis Yasin
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0015', 'Muhammad Younis Yasin', '1133602010', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0016: Amanda Juarez (grupo Juarez-Iñigo)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0016', 'Amanda Juarez', '3816735998', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Juarez-Iñigo'));

-- GJ-0017: Daniel Horacio Iñigo (grupo Juarez-Iñigo)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0017', 'Daniel Horacio Iñigo', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Juarez-Iñigo'));

-- GJ-0018: Valentino Iñigo (grupo Juarez-Iñigo)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0018', 'Valentino Iñigo', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Juarez-Iñigo'));

-- GJ-0019: Agostina Aylen Suero
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0019', 'Agostina Aylen Suero', '3814651096', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0020: Santino Tomas Viera — deuda completa 200k
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0020', 'Santino Tomas Viera', '2246589898', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Deuda completa 200k', NULL, NULL);

-- GJ-0021: Benjamin Exequiel Amado (grupo con Cristina)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0021', 'Benjamin Exequiel Amado', '2974134187', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'CONTACTADO, no pasaporte. Deuda 150k paga marzo.', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Benjamin Amado y Cristina Riquelme'));

-- GJ-0022: Cristina Riquelme (grupo con Benjamin)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0022', 'Cristina Riquelme', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'CONTACTADO, no pasaporte. Deuda 150k paga marzo.', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Benjamin Amado y Cristina Riquelme'));

-- GJ-0023: Lucas Gonzalo Depierro
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0023', 'Lucas Gonzalo Depierro', '3571592374', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0024: Ezequiel Pedacci (grupo con Mariano)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0024', 'Ezequiel Pedacci', '3813284152', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Ezequiel Pedacci y Mariano Colomo'));

-- GJ-0025: Mariano Colomo (grupo con Ezequiel)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0025', 'Mariano Colomo', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Ezequiel Pedacci y Mariano Colomo'));

-- GJ-0026: Nacho
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0026', 'Nacho', '1136325254', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0027: Leticia Gimenez (grupo con Ignacio)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0027', 'Leticia Gimenez', '3815831747', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Leticia Gimenez e Ignacio Celerino'));

-- GJ-0028: Ignacio Celerino (grupo con Leticia)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0028', 'Ignacio Celerino', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Leticia Gimenez e Ignacio Celerino'));

-- GJ-0029: Fabio Farid Lescano
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0029', 'Fabio Farid Lescano', '3885870676', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0030: Santiago Scarione
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0030', 'Santiago Scarione', '3442641618', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0031: Tomas Caner
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0031', 'Tomas Caner', '3814909313', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0032: Elian Franco Mayocchi
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0032', 'Elian Franco Mayocchi', '2216791376', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0033: Sofia Farias (grupo con Ignacio Zerda)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0033', 'Sofia Farias', '3815378907', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Sofia Farias e Ignacio Zerda'));

-- GJ-0034: Ignacio Zerda (grupo con Sofia)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0034', 'Ignacio Zerda', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Sofia Farias e Ignacio Zerda'));

-- GJ-0035: Leandro Tello
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0035', 'Leandro Tello', '1130851932', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0036: Milagros Veronico Lescano
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0036', 'Milagros Veronico Lescano', '3813318992', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0037: Jeremias Mauricio Hoyos Muñoz
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0037', 'Jeremias Mauricio Hoyos Muñoz', '3815222260', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0038: Sofia Belen Damia
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0038', 'Sofia Belen Damia', '3815454077', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0039: Maria del Rosario Savino
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0039', 'Maria del Rosario Savino', '3813958366', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0040: Maria Candelaria Gonzalez
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0040', 'Maria Candelaria Gonzalez', '3813490002', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0041: Braian Aguirre (grupo con Mara y Ernesto)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0041', 'Braian Aguirre', '3834239926', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Braian Aguirre, Mara Aybar y Ernesto Avalo'));

-- GJ-0042: Mara Sabrina Aybar (grupo con Braian)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0042', 'Mara Sabrina Aybar', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Pago incluido por Braian Aguirre', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Braian Aguirre, Mara Aybar y Ernesto Avalo'));

-- GJ-0043: Ernesto Javier Avalo (grupo con Braian)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0043', 'Ernesto Javier Avalo', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Pago incluido por Braian Aguirre', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Braian Aguirre, Mara Aybar y Ernesto Avalo'));

-- GJ-0044: Facundo Colin Elias (grupo con Novia)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0044', 'Facundo Colin Elias', '3814632846', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'CONTACTADO, no pasaporte', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Facundo Colin Elias y Novia'));

-- GJ-0045: Novia de Facundo Colin Elias (grupo con Facundo)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0045', 'Novia de Facundo Colin Elias', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'CONTACTADO, no pasaporte. Debe 200k.', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Facundo Colin Elias y Novia'));

-- GJ-0046: Agustin Moreno (grupo con Novia)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0046', 'Agustin Moreno', '5219844983161', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Agustin Moreno y Novia'));

-- GJ-0047: Novia de Agustin Moreno (grupo con Agustin)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0047', 'Novia de Agustin Moreno', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Agustin Moreno y Novia'));

-- GJ-0048: Jeronimo Quiroga
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0048', 'Jeronimo Quiroga', '3813659780', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0049: Paz Viviana Merlina (grupo con Sebastian)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0049', 'Paz Viviana Merlina', '3794808567', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Paz Merlina y Sebastian Lopez Noir'));

-- GJ-0050: Lopez Noir Sebastian Jose (grupo con Paz)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0050', 'Lopez Noir Sebastian Jose', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Debe 200k, paga abril', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Paz Merlina y Sebastian Lopez Noir'));

-- GJ-0051: Nadia Enria (grupo Familia Enria)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0051', 'Nadia Enria', '3816482618', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Debe 300k paga abril', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Enria'));

-- GJ-0052: Padre de Nadia Enria (grupo Familia Enria)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0052', 'Padre de Nadia Enria', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Enria'));

-- GJ-0053: Madre de Nadia Enria (grupo Familia Enria)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0053', 'Madre de Nadia Enria', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Enria'));

-- GJ-0054: Mariquena Lopez Berra
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0054', 'Mariquena Lopez Berra', '3517522387', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0055: Maria Belen Davito
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0055', 'Maria Belen Davito', '3537671433', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0056: Benjamin (solo nombre)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0056', 'Benjamin', '3865201991', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Debe 100k paga abril', NULL, NULL);

-- GJ-0057: Franco Ricardo Aragon
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0057', 'Franco Ricardo Aragon', '3816625408', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0058: Betina Pioli
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0058', 'Betina Pioli', '3834919080', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0059: Franco Exequiel
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0059', 'Franco Exequiel', '1135934964', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0060: Ernesto Andre Zamora Beltran (grupo Zamora)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0060', 'Ernesto Andre Zamora Beltran', '1167570748', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Zamora Beltran'));

-- GJ-0061: Esposa de Ernesto Zamora Beltran (grupo Zamora)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0061', 'Esposa de Ernesto Zamora Beltran', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Zamora Beltran'));

-- GJ-0062: Hija de Ernesto Zamora Beltran (grupo Zamora)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0062', 'Hija de Ernesto Zamora Beltran', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Familia Zamora Beltran'));

-- GJ-0063: Gonzalo Jesus Barilari (grupo con Amigo)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0063', 'Gonzalo Jesus Barilari', '3813678791', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Gonzalo Barilari y Amigo'));

-- GJ-0064: Amigo de Gonzalo Barilari (grupo con Gonzalo)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0064', 'Amigo de Gonzalo Barilari', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Gonzalo Barilari y Amigo'));

-- GJ-0065: Bernabe Exequiel Gonzalez (grupo con Maria Teresa)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0065', 'Bernabe Exequiel Gonzalez', '3814741185', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Debe 40k', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Bernabe Gonzalez y Maria Teresa'));

-- GJ-0066: Maria Teresa (grupo con Bernabe)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0066', 'Maria Teresa', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', 'Pago por Bernabe. Debe 100k.', NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Bernabe Gonzalez y Maria Teresa'));

-- GJ-0067: Luis Javier
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0067', 'Luis Javier', '1130580428', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL, NULL);

-- GJ-0068: Daniel Fiat (grupo con Hija)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0068', 'Daniel Fiat', '3795015615', NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Daniel Fiat e Hija'));

-- GJ-0069: Hija de Daniel Fiat (grupo con Daniel)
INSERT INTO clientes (id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id)
VALUES (gen_random_uuid(), 'GJ-0069', 'Hija de Daniel Fiat', NULL, NULL, NULL, NULL, 'WHATSAPP', 'ACTIVO', NULL, NULL,
  (SELECT id FROM grupos_familiares WHERE nombre = 'Daniel Fiat e Hija'));

-- =============================================================================
-- 3. VISAS (68 visas — all clients except Maria Abboud GJ-0001)
-- =============================================================================

-- VISA-0001: Facundo Ortega — 2/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0001', (SELECT id FROM clientes WHERE gj_id = 'GJ-0002'), 'EN_PROCESO', NULL, '2026-01-02', NULL);

-- VISA-0002: Emilce Agustina Lopez — 2/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0002', (SELECT id FROM clientes WHERE gj_id = 'GJ-0003'), 'EN_PROCESO', NULL, '2026-01-02', NULL);

-- VISA-0003: Matias Serrano Gramajo — 2/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0003', (SELECT id FROM clientes WHERE gj_id = 'GJ-0004'), 'EN_PROCESO', NULL, '2026-01-02', NULL);

-- VISA-0004: Simon Tobias Costilla — 16/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0004', (SELECT id FROM clientes WHERE gj_id = 'GJ-0005'), 'EN_PROCESO', NULL, '2026-01-16', NULL);

-- VISA-0005: Costilla Carlos David — 16/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0005', (SELECT id FROM clientes WHERE gj_id = 'GJ-0006'), 'EN_PROCESO', NULL, '2026-01-16', NULL);

-- VISA-0006: Javier Agustin Hernandez — 16/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0006', (SELECT id FROM clientes WHERE gj_id = 'GJ-0007'), 'EN_PROCESO', NULL, '2026-01-16', NULL);

-- VISA-0007: Matias Ruiz — 13/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0007', (SELECT id FROM clientes WHERE gj_id = 'GJ-0008'), 'EN_PROCESO', NULL, '2026-01-13', NULL);

-- VISA-0008: Martina Diaz — 15/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0008', (SELECT id FROM clientes WHERE gj_id = 'GJ-0009'), 'EN_PROCESO', NULL, '2026-01-15', NULL);

-- VISA-0009: Samir Zehid — 5/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0009', (SELECT id FROM clientes WHERE gj_id = 'GJ-0010'), 'EN_PROCESO', NULL, '2026-01-05', NULL);

-- VISA-0010: Camila Nair Amado — 23/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0010', (SELECT id FROM clientes WHERE gj_id = 'GJ-0011'), 'EN_PROCESO', NULL, '2026-01-23', NULL);

-- VISA-0011: Gonzalo Tabares — 9/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0011', (SELECT id FROM clientes WHERE gj_id = 'GJ-0012'), 'EN_PROCESO', NULL, '2026-01-09', NULL);

-- VISA-0012: Gaspar Jauregui — 27/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0012', (SELECT id FROM clientes WHERE gj_id = 'GJ-0013'), 'EN_PROCESO', NULL, '2026-01-27', NULL);

-- VISA-0013: Josefina Jara — 30/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0013', (SELECT id FROM clientes WHERE gj_id = 'GJ-0014'), 'EN_PROCESO', NULL, '2026-01-30', NULL);

-- VISA-0014: Muhammad Younis Yasin — 31/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0014', (SELECT id FROM clientes WHERE gj_id = 'GJ-0015'), 'EN_PROCESO', NULL, '2026-01-31', NULL);

-- VISA-0015: Amanda Juarez — 28/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0015', (SELECT id FROM clientes WHERE gj_id = 'GJ-0016'), 'EN_PROCESO', NULL, '2026-01-28', NULL);

-- VISA-0016: Daniel Horacio Iñigo — 28/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0016', (SELECT id FROM clientes WHERE gj_id = 'GJ-0017'), 'EN_PROCESO', NULL, '2026-01-28', NULL);

-- VISA-0017: Valentino Iñigo — 28/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0017', (SELECT id FROM clientes WHERE gj_id = 'GJ-0018'), 'EN_PROCESO', NULL, '2026-01-28', NULL);

-- VISA-0018: Agostina Aylen Suero — 27/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0018', (SELECT id FROM clientes WHERE gj_id = 'GJ-0019'), 'EN_PROCESO', NULL, '2026-01-27', NULL);

-- VISA-0019: Santino Tomas Viera — 21/1
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0019', (SELECT id FROM clientes WHERE gj_id = 'GJ-0020'), 'EN_PROCESO', NULL, '2026-01-21', NULL);

-- VISA-0020: Benjamin Exequiel Amado — 2/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0020', (SELECT id FROM clientes WHERE gj_id = 'GJ-0021'), 'EN_PROCESO', NULL, '2026-02-02', NULL);

-- VISA-0021: Cristina Riquelme — 2/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0021', (SELECT id FROM clientes WHERE gj_id = 'GJ-0022'), 'EN_PROCESO', NULL, '2026-02-02', NULL);

-- VISA-0022: Lucas Gonzalo Depierro — 4/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0022', (SELECT id FROM clientes WHERE gj_id = 'GJ-0023'), 'EN_PROCESO', NULL, '2026-02-04', NULL);

-- VISA-0023: Ezequiel Pedacci — 4/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0023', (SELECT id FROM clientes WHERE gj_id = 'GJ-0024'), 'EN_PROCESO', NULL, '2026-02-04', NULL);

-- VISA-0024: Mariano Colomo — 4/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0024', (SELECT id FROM clientes WHERE gj_id = 'GJ-0025'), 'EN_PROCESO', NULL, '2026-02-04', NULL);

-- VISA-0025: Nacho — 6/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0025', (SELECT id FROM clientes WHERE gj_id = 'GJ-0026'), 'EN_PROCESO', NULL, '2026-02-06', NULL);

-- VISA-0026: Leticia Gimenez — 10/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0026', (SELECT id FROM clientes WHERE gj_id = 'GJ-0027'), 'EN_PROCESO', NULL, '2026-02-10', NULL);

-- VISA-0027: Ignacio Celerino — 10/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0027', (SELECT id FROM clientes WHERE gj_id = 'GJ-0028'), 'EN_PROCESO', NULL, '2026-02-10', NULL);

-- VISA-0028: Fabio Farid Lescano — 15/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0028', (SELECT id FROM clientes WHERE gj_id = 'GJ-0029'), 'EN_PROCESO', NULL, '2026-02-15', NULL);

-- VISA-0029: Santiago Scarione — 16/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0029', (SELECT id FROM clientes WHERE gj_id = 'GJ-0030'), 'EN_PROCESO', NULL, '2026-02-16', NULL);

-- VISA-0030: Tomas Caner — 16/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0030', (SELECT id FROM clientes WHERE gj_id = 'GJ-0031'), 'EN_PROCESO', NULL, '2026-02-16', NULL);

-- VISA-0031: Elian Franco Mayocchi — 19/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0031', (SELECT id FROM clientes WHERE gj_id = 'GJ-0032'), 'EN_PROCESO', NULL, '2026-02-19', NULL);

-- VISA-0032: Sofia Farias — 18/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0032', (SELECT id FROM clientes WHERE gj_id = 'GJ-0033'), 'EN_PROCESO', NULL, '2026-02-18', NULL);

-- VISA-0033: Ignacio Zerda — 18/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0033', (SELECT id FROM clientes WHERE gj_id = 'GJ-0034'), 'EN_PROCESO', NULL, '2026-02-18', NULL);

-- VISA-0034: Leandro Tello — 19/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0034', (SELECT id FROM clientes WHERE gj_id = 'GJ-0035'), 'EN_PROCESO', NULL, '2026-02-19', NULL);

-- VISA-0035: Milagros Veronico Lescano — 19/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0035', (SELECT id FROM clientes WHERE gj_id = 'GJ-0036'), 'EN_PROCESO', NULL, '2026-02-19', NULL);

-- VISA-0036: Jeremias Mauricio Hoyos Muñoz — 20/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0036', (SELECT id FROM clientes WHERE gj_id = 'GJ-0037'), 'EN_PROCESO', NULL, '2026-02-20', NULL);

-- VISA-0037: Sofia Belen Damia — 20/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0037', (SELECT id FROM clientes WHERE gj_id = 'GJ-0038'), 'EN_PROCESO', NULL, '2026-02-20', NULL);

-- VISA-0038: Maria del Rosario Savino — 25/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0038', (SELECT id FROM clientes WHERE gj_id = 'GJ-0039'), 'EN_PROCESO', NULL, '2026-02-25', NULL);

-- VISA-0039: Maria Candelaria Gonzalez — 24/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0039', (SELECT id FROM clientes WHERE gj_id = 'GJ-0040'), 'EN_PROCESO', NULL, '2026-02-24', NULL);

-- VISA-0040: Braian Aguirre — 27/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0040', (SELECT id FROM clientes WHERE gj_id = 'GJ-0041'), 'EN_PROCESO', NULL, '2026-02-27', NULL);

-- VISA-0041: Mara Sabrina Aybar — 2/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0041', (SELECT id FROM clientes WHERE gj_id = 'GJ-0042'), 'EN_PROCESO', NULL, '2026-03-02', NULL);

-- VISA-0042: Ernesto Javier Avalo — 2/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0042', (SELECT id FROM clientes WHERE gj_id = 'GJ-0043'), 'EN_PROCESO', NULL, '2026-03-02', NULL);

-- VISA-0043: Facundo Colin Elias — 28/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0043', (SELECT id FROM clientes WHERE gj_id = 'GJ-0044'), 'EN_PROCESO', NULL, '2026-02-28', NULL);

-- VISA-0044: Novia de Facundo Colin Elias — 28/2
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0044', (SELECT id FROM clientes WHERE gj_id = 'GJ-0045'), 'EN_PROCESO', NULL, '2026-02-28', NULL);

-- VISA-0045: Agustin Moreno — 02/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0045', (SELECT id FROM clientes WHERE gj_id = 'GJ-0046'), 'EN_PROCESO', NULL, '2026-03-02', NULL);

-- VISA-0046: Novia de Agustin Moreno — 02/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0046', (SELECT id FROM clientes WHERE gj_id = 'GJ-0047'), 'EN_PROCESO', NULL, '2026-03-02', NULL);

-- VISA-0047: Jeronimo Quiroga — 5/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0047', (SELECT id FROM clientes WHERE gj_id = 'GJ-0048'), 'EN_PROCESO', NULL, '2026-03-05', NULL);

-- VISA-0048: Paz Viviana Merlina — 10/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0048', (SELECT id FROM clientes WHERE gj_id = 'GJ-0049'), 'EN_PROCESO', NULL, '2026-03-10', NULL);

-- VISA-0049: Lopez Noir Sebastian Jose — 10/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0049', (SELECT id FROM clientes WHERE gj_id = 'GJ-0050'), 'EN_PROCESO', NULL, '2026-03-10', NULL);

-- VISA-0050: Nadia Enria — 10/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0050', (SELECT id FROM clientes WHERE gj_id = 'GJ-0051'), 'EN_PROCESO', NULL, '2026-03-10', NULL);

-- VISA-0051: Padre de Nadia Enria — 10/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0051', (SELECT id FROM clientes WHERE gj_id = 'GJ-0052'), 'EN_PROCESO', NULL, '2026-03-10', NULL);

-- VISA-0052: Madre de Nadia Enria — 10/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0052', (SELECT id FROM clientes WHERE gj_id = 'GJ-0053'), 'EN_PROCESO', NULL, '2026-03-10', NULL);

-- VISA-0053: Mariquena Lopez Berra — 17/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0053', (SELECT id FROM clientes WHERE gj_id = 'GJ-0054'), 'EN_PROCESO', NULL, '2026-03-17', NULL);

-- VISA-0054: Maria Belen Davito — 17/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0054', (SELECT id FROM clientes WHERE gj_id = 'GJ-0055'), 'EN_PROCESO', NULL, '2026-03-17', NULL);

-- VISA-0055: Benjamin — 19/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0055', (SELECT id FROM clientes WHERE gj_id = 'GJ-0056'), 'EN_PROCESO', NULL, '2026-03-19', NULL);

-- VISA-0056: Franco Ricardo Aragon — 18/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0056', (SELECT id FROM clientes WHERE gj_id = 'GJ-0057'), 'EN_PROCESO', NULL, '2026-03-18', NULL);

-- VISA-0057: Betina Pioli — 20/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0057', (SELECT id FROM clientes WHERE gj_id = 'GJ-0058'), 'EN_PROCESO', NULL, '2026-03-20', NULL);

-- VISA-0058: Franco Exequiel — 27/3
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0058', (SELECT id FROM clientes WHERE gj_id = 'GJ-0059'), 'EN_PROCESO', NULL, '2026-03-27', NULL);

-- VISA-0059: Ernesto Andre Zamora Beltran — 13/10
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0059', (SELECT id FROM clientes WHERE gj_id = 'GJ-0060'), 'EN_PROCESO', NULL, '2026-10-13', NULL);

-- VISA-0060: Esposa de Ernesto Zamora Beltran — 13/10
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0060', (SELECT id FROM clientes WHERE gj_id = 'GJ-0061'), 'EN_PROCESO', NULL, '2026-10-13', NULL);

-- VISA-0061: Hija de Ernesto Zamora Beltran — 13/10
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0061', (SELECT id FROM clientes WHERE gj_id = 'GJ-0062'), 'EN_PROCESO', NULL, '2026-10-13', NULL);

-- VISA-0062: Gonzalo Jesus Barilari — 26/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0062', (SELECT id FROM clientes WHERE gj_id = 'GJ-0063'), 'EN_PROCESO', NULL, '2026-03-26', NULL);

-- VISA-0063: Amigo de Gonzalo Barilari — 26/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0063', (SELECT id FROM clientes WHERE gj_id = 'GJ-0064'), 'EN_PROCESO', NULL, '2026-03-26', NULL);

-- VISA-0064: Bernabe Exequiel Gonzalez — 29/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0064', (SELECT id FROM clientes WHERE gj_id = 'GJ-0065'), 'EN_PROCESO', NULL, '2026-03-29', NULL);

-- VISA-0065: Maria Teresa — 30/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0065', (SELECT id FROM clientes WHERE gj_id = 'GJ-0066'), 'EN_PROCESO', NULL, '2026-03-30', NULL);

-- VISA-0066: Luis Javier — 30/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0066', (SELECT id FROM clientes WHERE gj_id = 'GJ-0067'), 'EN_PROCESO', NULL, '2026-03-30', NULL);

-- VISA-0067: Daniel Fiat — 08/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0067', (SELECT id FROM clientes WHERE gj_id = 'GJ-0068'), 'EN_PROCESO', NULL, '2026-03-08', NULL);

-- VISA-0068: Hija de Daniel Fiat — 08/03
INSERT INTO visas (id, visa_id, cliente_id, estado, ds160, fecha_turno, notas)
VALUES (gen_random_uuid(), 'VISA-0068', (SELECT id FROM clientes WHERE gj_id = 'GJ-0069'), 'EN_PROCESO', NULL, '2026-03-08', NULL);

-- =============================================================================
-- 4. PAGOS
-- =============================================================================

-- PAG-0001: Facundo Ortega — PAGADO 170000 (340k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0001',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0002'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0001'),
  'VISA', 170000, '2026-01-02', 'PAGADO', NULL, NULL, NULL);

-- PAG-0002: Emilce Agustina Lopez — PAGADO 170000 (340k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0002',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0003'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0002'),
  'VISA', 170000, '2026-01-02', 'PAGADO', NULL, NULL, NULL);

-- PAG-0003: Matias Serrano Gramajo — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0003',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0004'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0003'),
  'VISA', 200000, '2026-01-02', 'PAGADO', NULL, NULL, NULL);

-- PAG-0004: Simon Tobias Costilla — PAGADO 100000 (descuento por sumar 2 amigos)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0004',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0005'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0004'),
  'VISA', 100000, '2026-01-16', 'PAGADO', NULL, NULL, 'Descuento por sumar 2 amigos');

-- PAG-0005: Costilla Carlos David — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0005',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0006'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0005'),
  'VISA', 200000, '2026-01-16', 'PAGADO', NULL, NULL, NULL);

-- PAG-0006: Javier Agustin Hernandez — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0006',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0007'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0006'),
  'VISA', 200000, '2026-01-16', 'PAGADO', NULL, NULL, NULL);

-- PAG-0007: Matias Ruiz — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0007',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0008'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0007'),
  'VISA', 200000, '2026-01-13', 'PAGADO', NULL, NULL, NULL);

-- PAG-0008: Martina Diaz — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0008',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0009'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0008'),
  'VISA', 200000, '2026-01-15', 'PAGADO', NULL, NULL, NULL);

-- PAG-0009: Samir Zehid — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0009',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0010'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0009'),
  'VISA', 200000, '2026-01-05', 'PAGADO', NULL, NULL, NULL);

-- PAG-0010: Camila Nair Amado — PAGADO 100000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0010',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0011'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0010'),
  'VISA', 100000, '2026-01-23', 'PAGADO', NULL, NULL, NULL);

-- PAG-0011: Gonzalo Tabares — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0011',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0012'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0011'),
  'VISA', 200000, '2026-01-09', 'PAGADO', NULL, NULL, NULL);

-- PAG-0012: Gaspar Jauregui — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0012',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0013'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0012'),
  'VISA', 200000, '2026-01-27', 'PAGADO', NULL, NULL, NULL);

-- PAG-0013: Josefina Jara — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0013',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0014'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0013'),
  'VISA', 200000, '2026-01-30', 'PAGADO', NULL, NULL, NULL);

-- PAG-0014: Muhammad Younis Yasin — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0014',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0015'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0014'),
  'VISA', 200000, '2026-01-31', 'PAGADO', NULL, NULL, NULL);

-- PAG-0015: Amanda Juarez — PAGADO 133333 (400k / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0015',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0016'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0015'),
  'VISA', 133333, '2026-01-28', 'PAGADO', NULL, NULL, NULL);

-- PAG-0016: Daniel Horacio Iñigo — PAGADO 133333 (400k / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0016',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0017'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0016'),
  'VISA', 133333, '2026-01-28', 'PAGADO', NULL, NULL, NULL);

-- PAG-0017: Valentino Iñigo — PAGADO 133334 (400k / 3, remainder)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0017',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0018'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0017'),
  'VISA', 133334, '2026-01-28', 'PAGADO', NULL, NULL, NULL);

-- PAG-0018: Agostina Aylen Suero — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0018',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0019'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0018'),
  'VISA', 200000, '2026-01-27', 'PAGADO', NULL, NULL, NULL);

-- PAG-0019: Santino Tomas Viera — DEUDA 200000 (deuda completa)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0019',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0020'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0019'),
  'VISA', 200000, NULL, 'DEUDA', NULL, NULL, 'Deuda completa 200k');

-- PAG-0020: Benjamin Exequiel Amado — PAGADO 150000 (300k / 2 paid)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0020',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0021'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0020'),
  'VISA', 150000, '2026-02-02', 'PAGADO', NULL, NULL, NULL);

-- PAG-0021: Benjamin Exequiel Amado — DEUDA 75000 (150k / 2 owed)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0021',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0021'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0020'),
  'VISA', 75000, NULL, 'DEUDA', NULL, NULL, 'Deuda 150k paga marzo (parte de Benjamin)');

-- PAG-0022: Cristina Riquelme — PAGADO 150000 (300k / 2 paid)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0022',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0022'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0021'),
  'VISA', 150000, '2026-02-02', 'PAGADO', NULL, NULL, NULL);

-- PAG-0023: Cristina Riquelme — DEUDA 75000 (150k / 2 owed)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0023',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0022'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0021'),
  'VISA', 75000, NULL, 'DEUDA', NULL, NULL, 'Deuda 150k paga marzo (parte de Cristina)');

-- PAG-0024: Lucas Gonzalo Depierro — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0024',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0023'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0022'),
  'VISA', 200000, '2026-02-04', 'PAGADO', NULL, NULL, NULL);

-- PAG-0025: Ezequiel Pedacci — PAGADO 196000 (392k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0025',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0024'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0023'),
  'VISA', 196000, '2026-02-04', 'PAGADO', NULL, NULL, NULL);

-- PAG-0026: Mariano Colomo — PAGADO 196000 (392k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0026',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0025'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0024'),
  'VISA', 196000, '2026-02-04', 'PAGADO', NULL, NULL, NULL);

-- PAG-0027: Nacho — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0027',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0026'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0025'),
  'VISA', 200000, '2026-02-06', 'PAGADO', NULL, NULL, NULL);

-- PAG-0028: Leticia Gimenez — PAGADO 150000 (300k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0028',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0027'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0026'),
  'VISA', 150000, '2026-02-10', 'PAGADO', NULL, NULL, NULL);

-- PAG-0029: Ignacio Celerino — PAGADO 150000 (300k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0029',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0028'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0027'),
  'VISA', 150000, '2026-02-10', 'PAGADO', NULL, NULL, NULL);

-- PAG-0030: Fabio Farid Lescano — PAGADO 160000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0030',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0029'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0028'),
  'VISA', 160000, '2026-02-15', 'PAGADO', NULL, NULL, NULL);

-- PAG-0031: Santiago Scarione — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0031',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0030'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0029'),
  'VISA', 200000, '2026-02-16', 'PAGADO', NULL, NULL, NULL);

-- PAG-0032: Tomas Caner — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0032',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0031'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0030'),
  'VISA', 200000, '2026-02-16', 'PAGADO', NULL, NULL, NULL);

-- PAG-0033: Elian Franco Mayocchi — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0033',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0032'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0031'),
  'VISA', 200000, '2026-02-19', 'PAGADO', NULL, NULL, NULL);

-- PAG-0034: Sofia Farias — PAGADO 230000 (460k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0034',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0033'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0032'),
  'VISA', 230000, '2026-02-18', 'PAGADO', NULL, NULL, NULL);

-- PAG-0035: Ignacio Zerda — PAGADO 230000 (460k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0035',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0034'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0033'),
  'VISA', 230000, '2026-02-18', 'PAGADO', NULL, NULL, NULL);

-- PAG-0036: Leandro Tello — PAGADO 160000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0036',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0035'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0034'),
  'VISA', 160000, '2026-02-19', 'PAGADO', NULL, NULL, NULL);

-- PAG-0037: Milagros Veronico Lescano — PAGADO 160000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0037',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0036'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0035'),
  'VISA', 160000, '2026-02-19', 'PAGADO', NULL, NULL, NULL);

-- PAG-0038: Jeremias Mauricio Hoyos Muñoz — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0038',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0037'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0036'),
  'VISA', 200000, '2026-02-20', 'PAGADO', NULL, NULL, NULL);

-- PAG-0039: Sofia Belen Damia — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0039',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0038'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0037'),
  'VISA', 200000, '2026-02-20', 'PAGADO', NULL, NULL, NULL);

-- PAG-0040: Maria del Rosario Savino — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0040',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0039'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0038'),
  'VISA', 200000, '2026-02-25', 'PAGADO', NULL, NULL, NULL);

-- PAG-0041: Maria Candelaria Gonzalez — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0041',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0040'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0039'),
  'VISA', 200000, '2026-02-24', 'PAGADO', NULL, NULL, NULL);

-- PAG-0042: Braian Aguirre — PAGADO 166667 (500k / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0042',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0041'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0040'),
  'VISA', 166667, '2026-02-27', 'PAGADO', NULL, NULL, 'Pago total 500k por 3 personas');

-- PAG-0043: Mara Sabrina Aybar — PAGADO 166667 (pagado por Braian)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0043',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0042'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0041'),
  'VISA', 166667, '2026-03-02', 'PAGADO', NULL, 'Braian Aguirre', 'Pagado por Braian Aguirre');

-- PAG-0044: Ernesto Javier Avalo — PAGADO 166666 (pagado por Braian, remainder)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0044',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0043'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0042'),
  'VISA', 166666, '2026-03-02', 'PAGADO', NULL, 'Braian Aguirre', 'Pagado por Braian Aguirre');

-- PAG-0045: Facundo Colin Elias — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0045',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0044'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0043'),
  'VISA', 200000, '2026-02-28', 'PAGADO', NULL, NULL, NULL);

-- PAG-0046: Novia de Facundo Colin Elias — DEUDA 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0046',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0045'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0044'),
  'VISA', 200000, NULL, 'DEUDA', NULL, NULL, 'Debe 200k de la novia');

-- PAG-0047: Agustin Moreno — PAGADO 120000 (240k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0047',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0046'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0045'),
  'VISA', 120000, '2026-03-02', 'PAGADO', NULL, NULL, NULL);

-- PAG-0048: Novia de Agustin Moreno — PAGADO 120000 (240k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0048',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0047'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0046'),
  'VISA', 120000, '2026-03-02', 'PAGADO', NULL, NULL, NULL);

-- PAG-0049: Jeronimo Quiroga — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0049',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0048'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0047'),
  'VISA', 200000, '2026-03-05', 'PAGADO', NULL, NULL, NULL);

-- PAG-0050: Paz Viviana Merlina — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0050',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0049'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0048'),
  'VISA', 200000, '2026-03-10', 'PAGADO', NULL, NULL, NULL);

-- PAG-0051: Lopez Noir Sebastian Jose — DEUDA 200000 (pareja debe 200k paga abril)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0051',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0050'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0049'),
  'VISA', 200000, NULL, 'DEUDA', NULL, NULL, 'Debe 200k de la pareja, paga abril');

-- PAG-0052: Nadia Enria — PAGADO 100000 (300k / 3 paid)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0052',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0051'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0050'),
  'VISA', 100000, '2026-03-10', 'PAGADO', NULL, NULL, NULL);

-- PAG-0053: Nadia Enria — DEUDA 100000 (300k deuda / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0053',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0051'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0050'),
  'VISA', 100000, NULL, 'DEUDA', NULL, NULL, 'Debe 300k paga abril (parte de Nadia)');

-- PAG-0054: Padre de Nadia Enria — PAGADO 100000 (300k / 3 paid)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0054',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0052'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0051'),
  'VISA', 100000, '2026-03-10', 'PAGADO', NULL, NULL, NULL);

-- PAG-0055: Padre de Nadia Enria — DEUDA 100000 (300k deuda / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0055',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0052'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0051'),
  'VISA', 100000, NULL, 'DEUDA', NULL, NULL, 'Debe 300k paga abril (parte del Padre)');

-- PAG-0056: Madre de Nadia Enria — PAGADO 100000 (300k / 3 paid)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0056',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0053'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0052'),
  'VISA', 100000, '2026-03-10', 'PAGADO', NULL, NULL, NULL);

-- PAG-0057: Madre de Nadia Enria — DEUDA 100000 (300k deuda / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0057',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0053'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0052'),
  'VISA', 100000, NULL, 'DEUDA', NULL, NULL, 'Debe 300k paga abril (parte de la Madre)');

-- PAG-0058: Mariquena Lopez Berra — PAGADO 300000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0058',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0054'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0053'),
  'VISA', 300000, '2026-03-17', 'PAGADO', NULL, NULL, NULL);

-- PAG-0059: Maria Belen Davito — PAGADO 300000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0059',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0055'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0054'),
  'VISA', 300000, '2026-03-17', 'PAGADO', NULL, NULL, NULL);

-- PAG-0060: Benjamin — PAGADO 100000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0060',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0056'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0055'),
  'VISA', 100000, '2026-03-19', 'PAGADO', NULL, NULL, NULL);

-- PAG-0061: Benjamin — DEUDA 100000 (paga abril)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0061',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0056'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0055'),
  'VISA', 100000, NULL, 'DEUDA', NULL, NULL, 'Debe 100k paga abril');

-- PAG-0062: Franco Ricardo Aragon — PAGADO 160000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0062',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0057'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0056'),
  'VISA', 160000, '2026-03-18', 'PAGADO', NULL, NULL, NULL);

-- PAG-0063: Betina Pioli — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0063',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0058'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0057'),
  'VISA', 200000, '2026-03-20', 'PAGADO', NULL, NULL, NULL);

-- PAG-0064: Franco Exequiel — PAGADO 160000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0064',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0059'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0058'),
  'VISA', 160000, '2026-03-27', 'PAGADO', NULL, NULL, NULL);

-- PAG-0065: Ernesto Andre Zamora Beltran — PAGADO 133333 (400k / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0065',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0060'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0059'),
  'VISA', 133333, '2026-10-13', 'PAGADO', NULL, NULL, NULL);

-- PAG-0066: Esposa de Ernesto Zamora Beltran — PAGADO 133333 (400k / 3)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0066',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0061'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0060'),
  'VISA', 133333, '2026-10-13', 'PAGADO', NULL, NULL, NULL);

-- PAG-0067: Hija de Ernesto Zamora Beltran — PAGADO 133334 (400k / 3, remainder)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0067',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0062'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0061'),
  'VISA', 133334, '2026-10-13', 'PAGADO', NULL, NULL, NULL);

-- PAG-0068: Gonzalo Jesus Barilari — PAGADO 200000 (400k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0068',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0063'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0062'),
  'VISA', 200000, '2026-03-26', 'PAGADO', NULL, NULL, NULL);

-- PAG-0069: Amigo de Gonzalo Barilari — PAGADO 200000 (400k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0069',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0064'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0063'),
  'VISA', 200000, '2026-03-26', 'PAGADO', NULL, NULL, NULL);

-- PAG-0070: Bernabe Exequiel Gonzalez — PAGADO 100000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0070',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0065'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0064'),
  'VISA', 100000, '2026-03-29', 'PAGADO', NULL, NULL, NULL);

-- PAG-0071: Bernabe Exequiel Gonzalez — DEUDA 40000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0071',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0065'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0064'),
  'VISA', 40000, NULL, 'DEUDA', NULL, NULL, 'Debe 40k');

-- PAG-0072: Maria Teresa — PAGADO 100000 (pagado por Bernabe)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0072',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0066'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0065'),
  'VISA', 100000, '2026-03-30', 'PAGADO', NULL, 'Bernabe Exequiel Gonzalez', 'Pagado por Bernabe');

-- PAG-0073: Maria Teresa — DEUDA 100000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0073',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0066'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0065'),
  'VISA', 100000, NULL, 'DEUDA', NULL, NULL, 'Debe 100k');

-- PAG-0074: Luis Javier — PAGADO 200000
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0074',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0067'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0066'),
  'VISA', 200000, '2026-03-30', 'PAGADO', NULL, NULL, NULL);

-- PAG-0075: Daniel Fiat — PAGADO 100000 (200k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0075',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0068'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0067'),
  'VISA', 100000, '2026-03-08', 'PAGADO', NULL, NULL, NULL);

-- PAG-0076: Hija de Daniel Fiat — PAGADO 100000 (200k / 2)
INSERT INTO pagos (id, pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas)
VALUES (gen_random_uuid(), 'PAG-0076',
  (SELECT id FROM clientes WHERE gj_id = 'GJ-0069'),
  (SELECT id FROM visas WHERE visa_id = 'VISA-0068'),
  'VISA', 100000, '2026-03-08', 'PAGADO', NULL, NULL, NULL);

-- =============================================================================
-- 5. HISTORIAL — Carga inicial para todos los clientes
-- =============================================================================

INSERT INTO historial (id, cliente_id, visa_id, tipo, descripcion, origen, usuario_id)
VALUES
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0001'), NULL, 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0002'), (SELECT id FROM visas WHERE visa_id = 'VISA-0001'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0003'), (SELECT id FROM visas WHERE visa_id = 'VISA-0002'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0004'), (SELECT id FROM visas WHERE visa_id = 'VISA-0003'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0005'), (SELECT id FROM visas WHERE visa_id = 'VISA-0004'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0006'), (SELECT id FROM visas WHERE visa_id = 'VISA-0005'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0007'), (SELECT id FROM visas WHERE visa_id = 'VISA-0006'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0008'), (SELECT id FROM visas WHERE visa_id = 'VISA-0007'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0009'), (SELECT id FROM visas WHERE visa_id = 'VISA-0008'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0010'), (SELECT id FROM visas WHERE visa_id = 'VISA-0009'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0011'), (SELECT id FROM visas WHERE visa_id = 'VISA-0010'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0012'), (SELECT id FROM visas WHERE visa_id = 'VISA-0011'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0013'), (SELECT id FROM visas WHERE visa_id = 'VISA-0012'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0014'), (SELECT id FROM visas WHERE visa_id = 'VISA-0013'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0015'), (SELECT id FROM visas WHERE visa_id = 'VISA-0014'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0016'), (SELECT id FROM visas WHERE visa_id = 'VISA-0015'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0017'), (SELECT id FROM visas WHERE visa_id = 'VISA-0016'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0018'), (SELECT id FROM visas WHERE visa_id = 'VISA-0017'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0019'), (SELECT id FROM visas WHERE visa_id = 'VISA-0018'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0020'), (SELECT id FROM visas WHERE visa_id = 'VISA-0019'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0021'), (SELECT id FROM visas WHERE visa_id = 'VISA-0020'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0022'), (SELECT id FROM visas WHERE visa_id = 'VISA-0021'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0023'), (SELECT id FROM visas WHERE visa_id = 'VISA-0022'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0024'), (SELECT id FROM visas WHERE visa_id = 'VISA-0023'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0025'), (SELECT id FROM visas WHERE visa_id = 'VISA-0024'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0026'), (SELECT id FROM visas WHERE visa_id = 'VISA-0025'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0027'), (SELECT id FROM visas WHERE visa_id = 'VISA-0026'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0028'), (SELECT id FROM visas WHERE visa_id = 'VISA-0027'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0029'), (SELECT id FROM visas WHERE visa_id = 'VISA-0028'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0030'), (SELECT id FROM visas WHERE visa_id = 'VISA-0029'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0031'), (SELECT id FROM visas WHERE visa_id = 'VISA-0030'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0032'), (SELECT id FROM visas WHERE visa_id = 'VISA-0031'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0033'), (SELECT id FROM visas WHERE visa_id = 'VISA-0032'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0034'), (SELECT id FROM visas WHERE visa_id = 'VISA-0033'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0035'), (SELECT id FROM visas WHERE visa_id = 'VISA-0034'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0036'), (SELECT id FROM visas WHERE visa_id = 'VISA-0035'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0037'), (SELECT id FROM visas WHERE visa_id = 'VISA-0036'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0038'), (SELECT id FROM visas WHERE visa_id = 'VISA-0037'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0039'), (SELECT id FROM visas WHERE visa_id = 'VISA-0038'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0040'), (SELECT id FROM visas WHERE visa_id = 'VISA-0039'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0041'), (SELECT id FROM visas WHERE visa_id = 'VISA-0040'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0042'), (SELECT id FROM visas WHERE visa_id = 'VISA-0041'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0043'), (SELECT id FROM visas WHERE visa_id = 'VISA-0042'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0044'), (SELECT id FROM visas WHERE visa_id = 'VISA-0043'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0045'), (SELECT id FROM visas WHERE visa_id = 'VISA-0044'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0046'), (SELECT id FROM visas WHERE visa_id = 'VISA-0045'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0047'), (SELECT id FROM visas WHERE visa_id = 'VISA-0046'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0048'), (SELECT id FROM visas WHERE visa_id = 'VISA-0047'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0049'), (SELECT id FROM visas WHERE visa_id = 'VISA-0048'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0050'), (SELECT id FROM visas WHERE visa_id = 'VISA-0049'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0051'), (SELECT id FROM visas WHERE visa_id = 'VISA-0050'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0052'), (SELECT id FROM visas WHERE visa_id = 'VISA-0051'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0053'), (SELECT id FROM visas WHERE visa_id = 'VISA-0052'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0054'), (SELECT id FROM visas WHERE visa_id = 'VISA-0053'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0055'), (SELECT id FROM visas WHERE visa_id = 'VISA-0054'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0056'), (SELECT id FROM visas WHERE visa_id = 'VISA-0055'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0057'), (SELECT id FROM visas WHERE visa_id = 'VISA-0056'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0058'), (SELECT id FROM visas WHERE visa_id = 'VISA-0057'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0059'), (SELECT id FROM visas WHERE visa_id = 'VISA-0058'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0060'), (SELECT id FROM visas WHERE visa_id = 'VISA-0059'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0061'), (SELECT id FROM visas WHERE visa_id = 'VISA-0060'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0062'), (SELECT id FROM visas WHERE visa_id = 'VISA-0061'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0063'), (SELECT id FROM visas WHERE visa_id = 'VISA-0062'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0064'), (SELECT id FROM visas WHERE visa_id = 'VISA-0063'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0065'), (SELECT id FROM visas WHERE visa_id = 'VISA-0064'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0066'), (SELECT id FROM visas WHERE visa_id = 'VISA-0065'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0067'), (SELECT id FROM visas WHERE visa_id = 'VISA-0066'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0068'), (SELECT id FROM visas WHERE visa_id = 'VISA-0067'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL),
  (gen_random_uuid(), (SELECT id FROM clientes WHERE gj_id = 'GJ-0069'), (SELECT id FROM visas WHERE visa_id = 'VISA-0068'), 'NUEVO_CLIENTE', 'Carga inicial VISAS 2026', 'dashboard', NULL);

COMMIT;
