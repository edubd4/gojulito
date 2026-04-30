-- ============================================================================
-- Migración VISAS 2026 - Paso 1/3: Clientes
-- Crea 61 clientes nuevos (GJ-0231 a GJ-0291) del programa de visas 2026.
-- Fuente: PDF "datos_pagos_1.pdf"
-- NOTA: Sin BEGIN/COMMIT para detectar errores por fila si los hubiera.
-- ============================================================================

-- GJ-0231: Facundo Ortega (grupo con Emilce)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0231', 'Facundo Ortega', '3816238289', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0232: Emilce Agustina Lopez (grupo con Facundo Ortega)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0232', 'Emilce Agustina Lopez', '3816238289', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0233: Matias Serrano Gramajo
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0233', 'Matias Serrano Gramajo', '3814474829', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0234: Simon Tobias Costilla
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0234', 'Simon Tobias Costilla', '3813009060', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0235: Costilla Carlos David
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0235', 'Costilla Carlos David', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0236: Javier Agustin Hernandez
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0236', 'Javier Agustin Hernandez', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0237: Matias Ruiz
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0237', 'Matias Ruiz', '3517628984', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0238: Martina Diaz
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0238', 'Martina Diaz', '3816217421', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0239: Samir Zehid
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0239', 'Samir Zehid', '2254612106', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0240: Camila Nair Amado
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0240', 'Camila Nair Amado', '2974099374', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0241: Gonzalo Tabares
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0241', 'Gonzalo Tabares', '3814457952', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0242: Gaspar Jauregui
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0242', 'Gaspar Jauregui', '1136997498', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0243: Josefina Jara
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0243', 'Josefina Jara', '3816555315', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0244: Muhammad Younis Yasin
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0244', 'Muhammad Younis Yasin', '1133602010', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0245: Amanda Juarez (grupo familia Inigo)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0245', 'Amanda Juarez', '3816735998', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0246: Daniel Horacio Inigo (grupo familia Inigo)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0246', 'Daniel Horacio Inigo', '3816735998', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0247: Valentino Inigo (grupo familia Inigo)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0247', 'Valentino Inigo', '3816735998', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0248: Agostina Aylen Suero
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0248', 'Agostina Aylen Suero', '3814651096', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0249: Santino Tomas Viera (deuda completa 200k)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0249', 'Santino Tomas Viera', '2246589898', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0250: Benjamin Exequiel Amado (grupo con Cristina - deuda 150k)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0250', 'Benjamin Exequiel Amado', '2974134187', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0251: Cristina Riquelme (grupo con Benjamin Amado)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0251', 'Cristina Riquelme', '2974134187', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0252: Lucas Gonzalo Depierro
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0252', 'Lucas Gonzalo Depierro', '3571592374', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0253: Ezequiel Pedacci (grupo con Mariano Colomo)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0253', 'Ezequiel Pedacci', '3813284152', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0254: Mariano Colomo (grupo con Ezequiel Pedacci)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0254', 'Mariano Colomo', '3813284152', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0255: Nacho (apellido pendiente)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0255', 'Nacho', '1136325254', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0256: Leticia Gimenez (grupo con Ignacio Celerino)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0256', 'Leticia Gimenez', '3815831747', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0257: Ignacio Celerino (grupo con Leticia Gimenez)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0257', 'Ignacio Celerino', '3815831747', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0258: Fabio Farid Lescano
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0258', 'Fabio Farid Lescano', '3885870676', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0259: Santiago Scarione
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0259', 'Santiago Scarione', '3442641618', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0260: Tomas Caner
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0260', 'Tomas Caner', '3814909313', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0261: Elian Franco Mayocchi
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0261', 'Elian Franco Mayocchi', '2216791376', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0262: Sofia Farias (grupo con Ignacio Zerda)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0262', 'Sofia Farias', '3815378907', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0263: Ignacio Zerda (grupo con Sofia Farias)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0263', 'Ignacio Zerda', '3815378907', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0264: Leandro Tello
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0264', 'Leandro Tello', '1130851932', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0265: Milagros Veronico Lescano
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0265', 'Milagros Veronico Lescano', '3813318992', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0266: Jeremias Mauricio Hoyos Munoz
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0266', 'Jeremias Mauricio Hoyos Munoz', '3815222260', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0267: Sofia Belen Damia
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0267', 'Sofia Belen Damia', '3815454077', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0268: Maria del Rosario Savino
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0268', 'Maria del Rosario Savino', '3813958366', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0269: Maria Candelaria Gonzalez
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0269', 'Maria Candelaria Gonzalez', '3813490002', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0270: Braian Aguirre (pago cubre +2 personas: Mara Aybar + Ernesto Avalo)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0270', 'Braian Aguirre', '3834239926', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0271: Agustin Moreno (novia sin nombre - no se registra)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0271', 'Agustin Moreno', '9844983161', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0272: Jeronimo Quiroga
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0272', 'Jeronimo Quiroga', '3813659780', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0273: Paz Viviana Merlina (grupo con Lopez Noir)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0273', 'Paz Viviana Merlina', '3794808567', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0274: Lopez Noir Sebastian Jose (debe 200k paga abril)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0274', 'Lopez Noir Sebastian Jose', '3794808567', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0275: Nadia Enria (grupo Padre+Madre sin nombres, todos deben 300k)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0275', 'Nadia Enria', '3816482618', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0276: Mariquena Lopez Berra
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0276', 'Mariquena Lopez Berra', '3517522387', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0277: Maria Belen Davito
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0277', 'Maria Belen Davito', '3537671433', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0278: Benjamin (apellido pendiente)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0278', 'Benjamin', '3865201991', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0279: Franco Ricardo Aragon
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0279', 'Franco Ricardo Aragon', '3816625408', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0280: Betina Pioli
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0280', 'Betina Pioli', '3834919080', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0281: Franco Exequiel
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0281', 'Franco Exequiel', '1135934964', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0282: Ernesto Andre Zamora Beltran (esposa e hija sin nombres)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0282', 'Ernesto Andre Zamora Beltran', '1167570748', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0283: Gonzalo Jesus Barilari (amigo sin nombre)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0283', 'Gonzalo Jesus Barilari', '3813678791', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0284: Bernabe Exequiel Gonzalez (debe 40k)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0284', 'Bernabe Exequiel Gonzalez', '3814741185', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0285: Maria Teresa (pago vinculado a Bernabe, debe 100k)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0285', 'Maria Teresa', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0286: Luis Javier (apellido pendiente)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0286', 'Luis Javier', '1130580428', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0287: Daniel Fiat (grupo con Brunella - su hija)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0287', 'Daniel Fiat', '3795015615', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0288: Brunella Fiat (hija de Daniel, nacida 2016)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0288', 'Brunella Fiat', '3795015615', '2016-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0289: Sheila Yazmin Jalil
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0289', 'Sheila Yazmin Jalil', '3813675989', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0290: Nico Isa (financiado 3 cuotas x 149528)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0290', 'Nico Isa', '3813650476', '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0291: Facundo Colin Elias (novia debe 200k, sin nombre)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0291', 'Facundo Colin Elias', '3814632846', '2000-01-01', 'ACTIVO', 'SEMINARIO');

-- Verificación
SELECT COUNT(*) FROM clientes WHERE gj_id BETWEEN 'GJ-0231' AND 'GJ-0291';
-- Esperado: 61
