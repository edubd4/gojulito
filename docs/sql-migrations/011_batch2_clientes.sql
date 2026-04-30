-- ============================================================================
-- Migración VISAS 2026 - Batch 2: Clientes faltantes del Excel
-- 91 clientes nuevos (GJ-0292 a GJ-0382)
-- Fuente: datos_visa_1.xlsx — filas no cargadas en la migración anterior
-- NOTA: Sin BEGIN/COMMIT para detectar errores por fila.
-- ============================================================================

-- ===== GRUPO 1: Excel filas 18-39 (GJ-0292 a GJ-0313) =====

-- GJ-0292: David Rodriguez (fila 18)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0292', 'David Rodriguez', NULL, '1991-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0293: Elias Moya (fila 19)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0293', 'Elias Moya', NULL, '1992-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0294: Adrian Gabriel Trillo (fila 20)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0294', 'Adrian Gabriel Trillo', NULL, '1991-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0295: Angel Daniel Bonahora Jaimes (fila 21)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0295', 'Angel Daniel Bonahora Jaimes', NULL, '1985-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0296: Guadalupe Aybar (fila 22)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0296', 'Guadalupe Aybar', NULL, '2002-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0297: Mauricio Jose Daniel Juarez Almeida (fila 23)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0297', 'Mauricio Jose Daniel Juarez Almeida', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0298: Dylan Abel Miranda (fila 24 - sin DS160, posiblemente emigro a Alemania)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0298', 'Dylan Abel Miranda', NULL, NULL, 'INACTIVO', 'SEMINARIO');
-- GJ-0299: Ana Agustina Gonzalez (fila 25)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0299', 'Ana Agustina Gonzalez', NULL, '1998-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0300: Tomas Agustin Castaneda (fila 26 - sin DS160, posiblemente emigro a Alemania)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0300', 'Tomas Agustin Castaneda', NULL, NULL, 'INACTIVO', 'SEMINARIO');
-- GJ-0301: Federico Emanuel Triveno (fila 27)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0301', 'Federico Emanuel Triveno', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0302: Benjamin Landivar (fila 28)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0302', 'Benjamin Landivar', NULL, '2002-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0303: Milagros Trejo (fila 29)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0303', 'Milagros Trejo', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0304: Kevin Alexis Maldonado (fila 30)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0304', 'Kevin Alexis Maldonado', NULL, '2002-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0305: Brenda Anahi Sosa (fila 31)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0305', 'Brenda Anahi Sosa', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0306: Eva Melany Martinez Paez (fila 32)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0306', 'Eva Melany Martinez Paez', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0307: Carlos Figueroa (fila 33)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0307', 'Carlos Figueroa', NULL, '1992-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0308: Hernan Chavez (fila 34 - sin año de nacimiento)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0308', 'Hernan Chavez', NULL, NULL, 'ACTIVO', 'SEMINARIO');
-- GJ-0309: Sol Daniela Lucero (fila 35)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0309', 'Sol Daniela Lucero', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0310: Esteban Gabriel Romero (fila 36)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0310', 'Esteban Gabriel Romero', NULL, '1998-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0311: Fernanda Anahi Di Franco (fila 37)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0311', 'Fernanda Anahi Di Franco', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0312: Sofia Lucero (fila 38 - nacida 2022, menor)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0312', 'Sofia Lucero', NULL, '2022-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0313: Diego Nicolas Fernandez (fila 39)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0313', 'Diego Nicolas Fernandez', NULL, '1991-01-01', 'ACTIVO', 'SEMINARIO');

-- ===== GRUPO 2: Excel filas 57-79 (GJ-0314 a GJ-0336) =====

-- GJ-0314: Sergio David Cisterna (fila 57)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0314', 'Sergio David Cisterna', NULL, '2005-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0315: Ignacio Romero (fila 58 - año 2024 parece error en Excel, se omite)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0315', 'Ignacio Romero', NULL, NULL, 'ACTIVO', 'SEMINARIO');
-- GJ-0316: Guadalupe Cana (fila 59)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0316', 'Guadalupe Cana', NULL, '2003-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0317: Enrique Maximiliano Mamonte (fila 60)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0317', 'Enrique Maximiliano Mamonte', NULL, '1997-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0318: Juan Ignacio Diaz (fila 61)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0318', 'Juan Ignacio Diaz', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0319: Florencia Ferrante (fila 62)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0319', 'Florencia Ferrante', NULL, '1993-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0320: Tiziano Julian Huel Roffe (fila 63)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0320', 'Tiziano Julian Huel Roffe', NULL, '2004-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0321: Santiago Gauna (fila 64)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0321', 'Santiago Gauna', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0322: Cecilia Veronica Bachi (fila 65)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0322', 'Cecilia Veronica Bachi', NULL, '1974-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0323: Pedro Javier Castillo (fila 66)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0323', 'Pedro Javier Castillo', NULL, '1973-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0324: Federico Duguech (fila 67 - diferente a Esteban Duguech GJ-0124)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0324', 'Federico Duguech', NULL, '2003-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0325: Gabriel Alejandro Avila (fila 68)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0325', 'Gabriel Alejandro Avila', NULL, '1997-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0326: Facundo Maximiliano Sierra (fila 69 - fila 106 "Facundo sierra (55)" es el mismo, se omite fila 106)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0326', 'Facundo Maximiliano Sierra', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0327: Nicolas Cambiasso (fila 70 - DS160 "AA000F26EI5" tiene un 0 extra segun Excel)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0327', 'Nicolas Cambiasso', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0328: Luciano Abel Salazar (fila 71)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0328', 'Luciano Abel Salazar', NULL, '1990-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0329: Marisol Martinez (fila 72 - misma familia que Luciano Salazar)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0329', 'Marisol Martinez', NULL, '1990-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0330: Alma Salazar (fila 73 - nacida 2019, hija de Luciano+Marisol)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0330', 'Alma Salazar', NULL, '2019-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0331: Patricio Alexandro Soberon (fila 74)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0331', 'Patricio Alexandro Soberon', NULL, '1996-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0332: Geronimo Jesus Cervera Piorno (fila 75)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0332', 'Geronimo Jesus Cervera Piorno', NULL, '2003-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0333: Alvaro Suero (fila 76 - nacido 2006, menor)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0333', 'Alvaro Suero', NULL, '2006-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0334: Marcos Facundo Arrieta (fila 77)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0334', 'Marcos Facundo Arrieta', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0335: Luz Milagros Aliaz Del Rio (fila 78 - misma familia/pareja que Arrieta)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0335', 'Luz Milagros Aliaz Del Rio', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0336: Florencia Guadalupe Rute Torres (fila 79)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0336', 'Florencia Guadalupe Rute Torres', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');

-- ===== GRUPO 3: Excel filas 98-121 (GJ-0337 a GJ-0358) =====
-- NOTA: fila 106 "Facundo sierra (55)" = mismo que fila 69 (GJ-0326), SE OMITE
-- NOTA: fila 108 "Facundo David Pincolini Castro" = GJ-0077 con nuevo DS160, ver UPDATEs al final

-- GJ-0337: Maria Cristina Leal (fila 98)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0337', 'Maria Cristina Leal', NULL, '1958-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0338: Axel Matteucci (fila 99 - nacido 2007, menor)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0338', 'Axel Matteucci', NULL, '2007-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0339: Josefina Romero (fila 100)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0339', 'Josefina Romero', NULL, '1992-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0340: Delfina Romero (fila 101 - nacida 2010, menor, posible hija de Josefina)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0340', 'Delfina Romero', NULL, '2010-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0341: Facundo Rodriguez Puentes (fila 102)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0341', 'Facundo Rodriguez Puentes', NULL, '2003-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0342: Guadalupe Del Rosario Anton (fila 103)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0342', 'Guadalupe Del Rosario Anton', NULL, '2002-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0343: Victor Gutierrez (fila 104)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0343', 'Victor Gutierrez', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0344: Magali Figueroa (fila 105)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0344', 'Magali Figueroa', NULL, '1996-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0345: Valeria Sofia Cocha Retiz (fila 107)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0345', 'Valeria Sofia Cocha Retiz', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0346: Hugo Sebastian Mamani (fila 109)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0346', 'Hugo Sebastian Mamani', NULL, '2002-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0347: Gladys Maria Isabel Venica (fila 110)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0347', 'Gladys Maria Isabel Venica', NULL, '1988-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0348: Emmanuel Galleotti (fila 111)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0348', 'Emmanuel Galleotti', NULL, '1989-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0349: Carolina Salvo (fila 112)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0349', 'Carolina Salvo', NULL, '2002-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0350: Milton Alejandro Satarain (fila 113)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0350', 'Milton Alejandro Satarain', NULL, '1997-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0351: Francisco Agustin Perez (fila 114)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0351', 'Francisco Agustin Perez', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0352: Joaquin Geronimo Jorge Forquera Yunes (fila 115 - en espera enero)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0352', 'Joaquin Geronimo Jorge Forquera Yunes', NULL, '1992-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0353: Maximiliano Christian Martinez Valais (fila 116)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0353', 'Maximiliano Christian Martinez Valais', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0354: Tamara Celeste Bauque (fila 117)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0354', 'Tamara Celeste Bauque', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0355: Alejo Daniel Migueli (fila 118)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0355', 'Alejo Daniel Migueli', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0356: Tomas Uriel Benencia Maccio (fila 119)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0356', 'Tomas Uriel Benencia Maccio', NULL, '1998-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0357: Gianella Abigail Alegre (fila 120 - nacida 2006, menor)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0357', 'Gianella Abigail Alegre', NULL, '2006-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0358: Simon Enoc Roquet (fila 121)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0358', 'Simon Enoc Roquet', NULL, '1998-01-01', 'ACTIVO', 'SEMINARIO');

-- ===== GRUPO 4: Excel filas 140-215 no cargadas (GJ-0359 a GJ-0382) =====
-- NOTA: fila 141 sin nombre, SE OMITE
-- NOTA: fila 183 Priscila Jazmin Fernandez = GJ-0126 con nuevo DS160, ver UPDATEs al final
-- NOTA: fila 184 Sergio David Cisterna = GJ-0314 con nuevo DS160, ver UPDATEs al final

-- GJ-0359: Carlos Alberto Torres (fila 140)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0359', 'Carlos Alberto Torres', NULL, '1967-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0360: Natanael Efrain Leon (fila 142)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0360', 'Natanael Efrain Leon', NULL, '1995-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0361: Rodrigo Leonel Alderete (fila 144)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0361', 'Rodrigo Leonel Alderete', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0362: Joel Alejandro De La Rosa (fila 147)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0362', 'Joel Alejandro De La Rosa', NULL, '2004-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0363: Maria de los Angeles Diaz (fila 151)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0363', 'Maria de los Angeles Diaz', NULL, '1973-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0364: Briana Maia Naomi Garnica (fila 152 - nacida 2011, menor)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0364', 'Briana Maia Naomi Garnica', NULL, '2011-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0365: Martha Gladys Altamirano (fila 155)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0365', 'Martha Gladys Altamirano', NULL, '1963-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0366: Ariela Bruno (fila 158)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0366', 'Ariela Bruno', NULL, '1997-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0367: Alejandro Talamet (fila 168)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0367', 'Alejandro Talamet', NULL, '1999-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0368: Juan Pablo Gonzalez (fila 170)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0368', 'Juan Pablo Gonzalez', NULL, '2004-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0369: Yamil Antonio Geciccio (fila 181)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0369', 'Yamil Antonio Geciccio', NULL, '1992-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0370: Ernesto Avalo (fila 186 - sin DS160, espera dinero)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0370', 'Ernesto Avalo', NULL, NULL, 'ACTIVO', 'SEMINARIO');
-- GJ-0371: Selene Abdala (fila 188)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0371', 'Selene Abdala', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0372: Mara Aybar (fila 189)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0372', 'Mara Aybar', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0373: Sebastian (fila 193 - sin apellido en Excel)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0373', 'Sebastian', NULL, '1985-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0374: Santiago Ariel Mendez (fila 194 - nacido 2006, menor)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0374', 'Santiago Ariel Mendez', NULL, '2006-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0375: Silvana Alejandra Belmonte Molina (fila 196 - madre de Nadia Enria GJ-0275)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0375', 'Silvana Alejandra Belmonte Molina', NULL, '1978-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0376: Hugo Ariel Enria (fila 197 - padre de Nadia Enria GJ-0275)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0376', 'Hugo Ariel Enria', NULL, '1965-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0377: Hector Julio Alberto Cardozo (fila 200)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0377', 'Hector Julio Alberto Cardozo', NULL, '1989-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0378: Gisela Belen Sanchez Zuge (fila 201)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0378', 'Gisela Belen Sanchez Zuge', NULL, '2001-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0379: Lautaro Nicolas Isidro Rotta (fila 202)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0379', 'Lautaro Nicolas Isidro Rotta', NULL, '2001-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0380: Angel Ignacio Coronel (fila 207)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0380', 'Angel Ignacio Coronel', NULL, '2002-01-01', 'ACTIVO', 'SEMINARIO');
-- GJ-0381: Juan Antonio Navarro (fila 212 - sin DS160)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0381', 'Juan Antonio Navarro', NULL, NULL, 'ACTIVO', 'SEMINARIO');
-- GJ-0382: Melina Aylen Visintin (fila 213)
INSERT INTO clientes (gj_id, nombre, telefono, fecha_nac, estado, canal) VALUES ('GJ-0382', 'Melina Aylen Visintin', NULL, '2000-01-01', 'ACTIVO', 'SEMINARIO');

-- ===== CORRECCIONES EN CLIENTES EXISTENTES =====

-- Actualizar nombre de GJ-0255 (cargado como "Nacho", apellido encontrado en Excel fila 164)
UPDATE clientes SET nombre = 'Ignacio Mozeluk' WHERE gj_id = 'GJ-0255';

-- Verificacion
SELECT COUNT(*) FROM clientes WHERE gj_id BETWEEN 'GJ-0292' AND 'GJ-0382';
-- Esperado: 91
