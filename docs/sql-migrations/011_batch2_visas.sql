-- ============================================================================
-- Migración VISAS 2026 - Batch 2: Visas para los 91 clientes nuevos
-- 91 visas (VISA-0291 a VISA-0381)
-- Fuente: datos_visa_1.xlsx
-- NOTA: Sin BEGIN/COMMIT para detectar errores por fila.
-- ============================================================================

-- ===== GRUPO 1: GJ-0292 a GJ-0313 → VISA-0291 a VISA-0312 =====

-- VISA-0291: David Rodriguez (GJ-0292) - DS: AA00EVL6ZV
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0291', (SELECT id FROM clientes WHERE gj_id='GJ-0292'), 'AA00EVL6ZV', 'drrod85@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0292: Elias Moya (GJ-0293) - DS: AA00EVLH57
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0292', (SELECT id FROM clientes WHERE gj_id='GJ-0293'), 'AA00EVLH57', 'arielsuarezariel@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0293: Adrian Gabriel Trillo (GJ-0294) - DS: AA00EVM3O5
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0293', (SELECT id FROM clientes WHERE gj_id='GJ-0294'), 'AA00EVM3O5', 'adriangabrieltrillo@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0294: Angel Daniel Bonahora Jaimes (GJ-0295) - DS: AA00EVS07L
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0294', (SELECT id FROM clientes WHERE gj_id='GJ-0295'), 'AA00EVS07L', 'danybona@hotmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0295: Guadalupe Aybar (GJ-0296) - DS: AA00EW041N
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0295', (SELECT id FROM clientes WHERE gj_id='GJ-0296'), 'AA00EW041N', 'guadaaybar85@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0296: Mauricio Jose Daniel Juarez Almeida (GJ-0297) - DS: AA00EVXIZ3
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0296', (SELECT id FROM clientes WHERE gj_id='GJ-0297'), 'AA00EVXIZ3', 'mauricioalmeida129@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0297: Dylan Abel Miranda (GJ-0298) - sin DS160, estado CANCELADA
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0297', (SELECT id FROM clientes WHERE gj_id='GJ-0298'), NULL, NULL, 'CANCELADA', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0298: Ana Agustina Gonzalez (GJ-0299) - DS: AA00EWFOE3
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0298', (SELECT id FROM clientes WHERE gj_id='GJ-0299'), 'AA00EWFOE3', 'anaagustinagonzalez@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0299: Tomas Agustin Castaneda (GJ-0300) - sin DS160, estado CANCELADA
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0299', (SELECT id FROM clientes WHERE gj_id='GJ-0300'), NULL, NULL, 'CANCELADA', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0300: Federico Emanuel Triveno (GJ-0301) - DS: AA00EY0X4H
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0300', (SELECT id FROM clientes WHERE gj_id='GJ-0301'), 'AA00EY0X4H', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0301: Benjamin Landivar (GJ-0302) - DS: AA00EYAICB
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0301', (SELECT id FROM clientes WHERE gj_id='GJ-0302'), 'AA00EYAICB', 'benjaminlandivar02@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0302: Milagros Trejo (GJ-0303) - DS: AA00EYALGN
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0302', (SELECT id FROM clientes WHERE gj_id='GJ-0303'), 'AA00EYALGN', 'milagrostrejo03@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0303: Kevin Alexis Maldonado (GJ-0304) - DS: AA00EYE4VB
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0303', (SELECT id FROM clientes WHERE gj_id='GJ-0304'), 'AA00EYE4VB', 'kmaldonado1602@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0304: Brenda Anahi Sosa (GJ-0305) - DS: AA00EYGY5P
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0304', (SELECT id FROM clientes WHERE gj_id='GJ-0305'), 'AA00EYGY5P', 'brendasosa080499@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0305: Eva Melany Martinez Paez (GJ-0306) - DS: AA00EZ3HAR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0305', (SELECT id FROM clientes WHERE gj_id='GJ-0306'), 'AA00EZ3HAR', 'evamelanypaez@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0306: Carlos Figueroa (GJ-0307) - DS: AA00EZ6CFH
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0306', (SELECT id FROM clientes WHERE gj_id='GJ-0307'), 'AA00EZ6CFH', 'Lcdo.carlossalazar@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0307: Hernan Chavez (GJ-0308) - DS: AA00EZTSRH
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0307', (SELECT id FROM clientes WHERE gj_id='GJ-0308'), 'AA00EZTSRH', 'Motomel050@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0308: Sol Daniela Lucero (GJ-0309) - DS: AA00EZY34X
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0308', (SELECT id FROM clientes WHERE gj_id='GJ-0309'), 'AA00EZY34X', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0309: Esteban Gabriel Romero (GJ-0310) - DS: AA00F0CD5R
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0309', (SELECT id FROM clientes WHERE gj_id='GJ-0310'), 'AA00F0CD5R', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0310: Fernanda Anahi Di Franco (GJ-0311) - DS: AA00F0CFNZ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0310', (SELECT id FROM clientes WHERE gj_id='GJ-0311'), 'AA00F0CFNZ', 'difrancofernandaa@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0311: Sofia Lucero (GJ-0312) - DS: AA00F0DX3R
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0311', (SELECT id FROM clientes WHERE gj_id='GJ-0312'), 'AA00F0DX3R', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0312: Diego Nicolas Fernandez (GJ-0313) - DS: AA00F0FO0T
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0312', (SELECT id FROM clientes WHERE gj_id='GJ-0313'), 'AA00F0FO0T', 'Nicocaballito@live.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- ===== GRUPO 2: GJ-0314 a GJ-0336 → VISA-0313 a VISA-0335 =====

-- VISA-0313: Sergio David Cisterna (GJ-0314) - DS: AA00F1M10R
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0313', (SELECT id FROM clientes WHERE gj_id='GJ-0314'), 'AA00F1M10R', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0314: Ignacio Romero (GJ-0315) - DS: AA00F1OLLV
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0314', (SELECT id FROM clientes WHERE gj_id='GJ-0315'), 'AA00F1OLLV', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0315: Guadalupe Cana (GJ-0316) - DS: AA00F1OOYX
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0315', (SELECT id FROM clientes WHERE gj_id='GJ-0316'), 'AA00F1OOYX', 'caguadalupe934@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0316: Enrique Maximiliano Mamonte (GJ-0317) - DS: AA00F1OSO3
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0316', (SELECT id FROM clientes WHERE gj_id='GJ-0317'), 'AA00F1OSO3', 'mamontemaxi@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0317: Juan Ignacio Diaz (GJ-0318) - DS: AA00F1OYO3
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0317', (SELECT id FROM clientes WHERE gj_id='GJ-0318'), 'AA00F1OYO3', 'id707174@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0318: Florencia Ferrante (GJ-0319) - DS: AA00F1P167
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0318', (SELECT id FROM clientes WHERE gj_id='GJ-0319'), 'AA00F1P167', 'fflor.ferrante@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0319: Tiziano Julian Huel Roffe (GJ-0320) - DS: AA00F1RIRZ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0319', (SELECT id FROM clientes WHERE gj_id='GJ-0320'), 'AA00F1RIRZ', 'tizianohuel7@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0320: Santiago Gauna (GJ-0321) - DS: AA00FB5F5B
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0320', (SELECT id FROM clientes WHERE gj_id='GJ-0321'), 'AA00FB5F5B', 'santigauna4@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0321: Cecilia Veronica Bachi (GJ-0322) - DS: AA00F1RYSR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0321', (SELECT id FROM clientes WHERE gj_id='GJ-0322'), 'AA00F1RYSR', 'Ceciliabachi13@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0322: Pedro Javier Castillo (GJ-0323) - DS: AA00F1S7RJ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0322', (SELECT id FROM clientes WHERE gj_id='GJ-0323'), 'AA00F1S7RJ', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0323: Federico Duguech (GJ-0324) - DS: AA00F1S9F1
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0323', (SELECT id FROM clientes WHERE gj_id='GJ-0324'), 'AA00F1S9F1', 'Fededuguech03@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0324: Gabriel Alejandro Avila (GJ-0325) - DS: AA00F1SDQR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0324', (SELECT id FROM clientes WHERE gj_id='GJ-0325'), 'AA00F1SDQR', 'gabrielavilarespaldo@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0325: Facundo Maximiliano Sierra (GJ-0326) - DS: AA00F1SLKX
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0325', (SELECT id FROM clientes WHERE gj_id='GJ-0326'), 'AA00F1SLKX', 'Facundosierra64@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0326: Nicolas Cambiasso (GJ-0327) - DS: AA000F26EI5 (incluye 0 extra, tal como figura en Excel)
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0326', (SELECT id FROM clientes WHERE gj_id='GJ-0327'), 'AA000F26EI5', 'nicolas.cambiasso.nc@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0327: Luciano Abel Salazar (GJ-0328) - DS: AA00F1SVAR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0327', (SELECT id FROM clientes WHERE gj_id='GJ-0328'), 'AA00F1SVAR', 'marisolmartinez191190@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0328: Marisol Martinez (GJ-0329) - DS: AA00F1XHDD
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0328', (SELECT id FROM clientes WHERE gj_id='GJ-0329'), 'AA00F1XHDD', 'marisolmartinez191190@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0329: Alma Salazar (GJ-0330) - DS: AA00F1XQFL
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0329', (SELECT id FROM clientes WHERE gj_id='GJ-0330'), 'AA00F1XQFL', 'marisolmartinez191190@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0330: Patricio Alexandro Soberon (GJ-0331) - DS: AA00F1WNCJ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0330', (SELECT id FROM clientes WHERE gj_id='GJ-0331'), 'AA00F1WNCJ', 'patobostero2015@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0331: Geronimo Jesus Cervera Piorno (GJ-0332) - DS: AA00F1WTY1
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0331', (SELECT id FROM clientes WHERE gj_id='GJ-0332'), 'AA00F1WTY1', 'Jesuspiorno754@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0332: Alvaro Suero (GJ-0333) - DS: AA00F1X0XH
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0332', (SELECT id FROM clientes WHERE gj_id='GJ-0333'), 'AA00F1X0XH', 'alvarosuero1@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0333: Marcos Facundo Arrieta (GJ-0334) - DS: AA00F279YH
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0333', (SELECT id FROM clientes WHERE gj_id='GJ-0334'), 'AA00F279YH', 'facoop12@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0334: Luz Milagros Aliaz Del Rio (GJ-0335) - DS: AA00F27OTR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0334', (SELECT id FROM clientes WHERE gj_id='GJ-0335'), 'AA00F27OTR', 'facoop12@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0335: Florencia Guadalupe Rute Torres (GJ-0336) - DS: AA00F282VR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0335', (SELECT id FROM clientes WHERE gj_id='GJ-0336'), 'AA00F282VR', 'florrutetorres@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- ===== GRUPO 3: GJ-0337 a GJ-0358 → VISA-0336 a VISA-0357 =====

-- VISA-0336: Maria Cristina Leal (GJ-0337) - DS: AA00F4SDI5
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0336', (SELECT id FROM clientes WHERE gj_id='GJ-0337'), 'AA00F4SDI5', 'lealmariacristina33@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0337: Axel Matteucci (GJ-0338) - DS: AA00F4WHQ5
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0337', (SELECT id FROM clientes WHERE gj_id='GJ-0338'), 'AA00F4WHQ5', 'axelmatteucci07@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0338: Josefina Romero (GJ-0339) - DS: AA00F4WJM1
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0338', (SELECT id FROM clientes WHERE gj_id='GJ-0339'), 'AA00F4WJM1', 'jo.romero1@icloud.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0339: Delfina Romero (GJ-0340) - DS: AA00F5ETXL
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0339', (SELECT id FROM clientes WHERE gj_id='GJ-0340'), 'AA00F5ETXL', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0340: Facundo Rodriguez Puentes (GJ-0341) - DS: AA00F5NLK7
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0340', (SELECT id FROM clientes WHERE gj_id='GJ-0341'), 'AA00F5NLK7', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0341: Guadalupe Del Rosario Anton (GJ-0342) - DS: AA00F5NP7N
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0341', (SELECT id FROM clientes WHERE gj_id='GJ-0342'), 'AA00F5NP7N', 'guadaanton111@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0342: Victor Gutierrez (GJ-0343) - DS: AA00F5TYQD
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0342', (SELECT id FROM clientes WHERE gj_id='GJ-0343'), 'AA00F5TYQD', 'Victornahuel037@hotmail.com.ar', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0343: Magali Figueroa (GJ-0344) - DS: AA00F5XCF7
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0343', (SELECT id FROM clientes WHERE gj_id='GJ-0344'), 'AA00F5XCF7', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0344: Valeria Sofia Cocha Retiz (GJ-0345) - DS: AA00F63IHV
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0344', (SELECT id FROM clientes WHERE gj_id='GJ-0345'), 'AA00F63IHV', 'valeriasofia.cr@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0345: Hugo Sebastian Mamani (GJ-0346) - DS: AA00F63OLN
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0345', (SELECT id FROM clientes WHERE gj_id='GJ-0346'), 'AA00F63OLN', 'sebastianmamani477@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0346: Gladys Maria Isabel Venica (GJ-0347) - DS: AA00F6JK87
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0346', (SELECT id FROM clientes WHERE gj_id='GJ-0347'), 'AA00F6JK87', 'isabel_venica89@hotmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0347: Emmanuel Galleotti (GJ-0348) - DS: AA00F6JQFV
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0347', (SELECT id FROM clientes WHERE gj_id='GJ-0348'), 'AA00F6JQFV', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0348: Carolina Salvo (GJ-0349) - DS: AA00F6XU9T
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0348', (SELECT id FROM clientes WHERE gj_id='GJ-0349'), 'AA00F6XU9T', 'salvocarolina4@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0349: Milton Alejandro Satarain (GJ-0350) - DS: AA00F6YZEJ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0349', (SELECT id FROM clientes WHERE gj_id='GJ-0350'), 'AA00F6YZEJ', 'jnrsata@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0350: Francisco Agustin Perez (GJ-0351) - DS: AA00F716A9
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0350', (SELECT id FROM clientes WHERE gj_id='GJ-0351'), 'AA00F716A9', 'agustinperez99@icloud.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0351: Joaquin Geronimo Jorge Forquera Yunes (GJ-0352) - DS: AA00F79N9T - email invalido en Excel
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0351', (SELECT id FROM clientes WHERE gj_id='GJ-0352'), 'AA00F79N9T', NULL, 'PAUSADA', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0352: Maximiliano Christian Martinez Valais (GJ-0353) - DS: AA00F7COMJ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0352', (SELECT id FROM clientes WHERE gj_id='GJ-0353'), 'AA00F7COMJ', 'maximartinezagv@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0353: Tamara Celeste Bauque (GJ-0354) - DS: AA00F7F0YB
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0353', (SELECT id FROM clientes WHERE gj_id='GJ-0354'), 'AA00F7F0YB', 'tamibauque@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0354: Alejo Daniel Migueli (GJ-0355) - DS: AA00F7HSUH
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0354', (SELECT id FROM clientes WHERE gj_id='GJ-0355'), 'AA00F7HSUH', 'miguelialejo@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0355: Tomas Uriel Benencia Maccio (GJ-0356) - DS: AA00F7HVIB
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0355', (SELECT id FROM clientes WHERE gj_id='GJ-0356'), 'AA00F7HVIB', 'Tomasbenencia18@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0356: Gianella Abigail Alegre (GJ-0357) - DS: AA00F7RK7X
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0356', (SELECT id FROM clientes WHERE gj_id='GJ-0357'), 'AA00F7RK7X', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0357: Simon Enoc Roquet (GJ-0358) - DS: AA00F7RTBP
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0357', (SELECT id FROM clientes WHERE gj_id='GJ-0358'), 'AA00F7RTBP', 'padinsimon@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- ===== GRUPO 4: GJ-0359 a GJ-0382 → VISA-0358 a VISA-0381 =====

-- VISA-0358: Carlos Alberto Torres (GJ-0359) - DS: AA00F9CCYL
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0358', (SELECT id FROM clientes WHERE gj_id='GJ-0359'), 'AA00F9CCYL', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0359: Natanael Efrain Leon (GJ-0360) - DS: AA00F9D4DR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0359', (SELECT id FROM clientes WHERE gj_id='GJ-0360'), 'AA00F9D4DR', 'natanaelefrainleon@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0360: Rodrigo Leonel Alderete (GJ-0361) - DS: AA00F9STUZ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0360', (SELECT id FROM clientes WHERE gj_id='GJ-0361'), 'AA00F9STUZ', 'Leoeltucuuu777@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0361: Joel Alejandro De La Rosa (GJ-0362) - DS: AA00FA127D
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0361', (SELECT id FROM clientes WHERE gj_id='GJ-0362'), 'AA00FA127D', 'delarosajoel322@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0362: Maria de los Angeles Diaz (GJ-0363) - DS: AA00FB8F2P
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0362', (SELECT id FROM clientes WHERE gj_id='GJ-0363'), 'AA00FB8F2P', 'nony_diaz4@hotmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0363: Briana Maia Naomi Garnica (GJ-0364) - DS: AA00FB8HX9
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0363', (SELECT id FROM clientes WHERE gj_id='GJ-0364'), 'AA00FB8HX9', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0364: Martha Gladys Altamirano (GJ-0365) - DS: AA00FBMSLJ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0364', (SELECT id FROM clientes WHERE gj_id='GJ-0365'), 'AA00FBMSLJ', 'gladismartaaltamirano@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0365: Ariela Bruno (GJ-0366) - DS: AA00FGCFKV
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0365', (SELECT id FROM clientes WHERE gj_id='GJ-0366'), 'AA00FGCFKV', 'arielobruno@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0366: Alejandro Talamet (GJ-0367) - DS: AA00FC3WSB
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0366', (SELECT id FROM clientes WHERE gj_id='GJ-0367'), 'AA00FC3WSB', 'alejandrotamalet@hotmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0367: Juan Pablo Gonzalez (GJ-0368) - DS: AA00FD0T8H
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0367', (SELECT id FROM clientes WHERE gj_id='GJ-0368'), 'AA00FD0T8H', 'juanpablogonza22@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0368: Yamil Antonio Geciccio (GJ-0369) - DS: AA00FDHRTR
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0368', (SELECT id FROM clientes WHERE gj_id='GJ-0369'), 'AA00FDHRTR', 'ventuc2025@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0369: Ernesto Avalo (GJ-0370) - sin DS160, espera dinero
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0369', (SELECT id FROM clientes WHERE gj_id='GJ-0370'), NULL, 'ernestoavalo75@gmail.com', 'PAUSADA', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0370: Selene Abdala (GJ-0371) - DS: AA00FDXVAT
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0370', (SELECT id FROM clientes WHERE gj_id='GJ-0371'), 'AA00FDXVAT', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0371: Mara Aybar (GJ-0372) - DS: AA00FE2RCL
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0371', (SELECT id FROM clientes WHERE gj_id='GJ-0372'), 'AA00FE2RCL', 'maraaybar15@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0372: Sebastian (GJ-0373) - DS: AA00FEJFZZ
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0372', (SELECT id FROM clientes WHERE gj_id='GJ-0373'), 'AA00FEJFZZ', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0373: Santiago Ariel Mendez (GJ-0374) - DS: AA00FEJLLX
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0373', (SELECT id FROM clientes WHERE gj_id='GJ-0374'), 'AA00FEJLLX', 'santiagomendez1234567890@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0374: Silvana Alejandra Belmonte Molina (GJ-0375) - DS: AA00FENGT1
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0374', (SELECT id FROM clientes WHERE gj_id='GJ-0375'), 'AA00FENGT1', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0375: Hugo Ariel Enria (GJ-0376) - DS: AA00FETYUR (padre de Nadia GJ-0275)
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0375', (SELECT id FROM clientes WHERE gj_id='GJ-0376'), 'AA00FETYUR', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0376: Hector Julio Alberto Cardozo (GJ-0377) - DS: AA00FF4HUB
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0376', (SELECT id FROM clientes WHERE gj_id='GJ-0377'), 'AA00FF4HUB', 'Cardozo_119@hotmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0377: Gisela Belen Sanchez Zuge (GJ-0378) - DS: AA00FF4JKF
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0377', (SELECT id FROM clientes WHERE gj_id='GJ-0378'), 'AA00FF4JKF', 'zugegiselabelen@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0378: Lautaro Nicolas Isidro Rotta (GJ-0379) - DS: AA00FF7VUF
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0378', (SELECT id FROM clientes WHERE gj_id='GJ-0379'), 'AA00FF7VUF', NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0379: Angel Ignacio Coronel (GJ-0380) - DS: AA00FG90ON
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0379', (SELECT id FROM clientes WHERE gj_id='GJ-0380'), 'AA00FG90ON', 'ignacoronel2002@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0380: Juan Antonio Navarro (GJ-0381) - sin DS160
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0380', (SELECT id FROM clientes WHERE gj_id='GJ-0381'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- VISA-0381: Melina Aylen Visintin (GJ-0382) - DS: AA00FH582H
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id)
VALUES ('VISA-0381', (SELECT id FROM clientes WHERE gj_id='GJ-0382'), 'AA00FH582H', 'melivisintin@gmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso='USA'));

-- ===== CORRECCIONES DS160 EN VISAS EXISTENTES =====

-- Facundo David Pincolini (GJ-0077) tenia DS AA00ETSJMB (PAUSA), nuevo DS: AA00F63MN1
UPDATE visas SET ds160 = 'AA00F63MN1', email_portal = 'facundopincolini101@gmail.com'
WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0077');

-- Priscila Jazmin Fernandez (GJ-0126) nuevo DS: AA00FDKG0N
UPDATE visas SET ds160 = 'AA00FDKG0N'
WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0126');

-- Sergio David Cisterna (GJ-0314, fila 57) nuevo DS de fila 184: AA00FDKLQ9
UPDATE visas SET ds160 = 'AA00FDKLQ9'
WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0314');

-- Verificacion
SELECT COUNT(*) FROM visas WHERE visa_id BETWEEN 'VISA-0291' AND 'VISA-0381';
-- Esperado: 91
