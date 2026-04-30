-- ============================================================================
-- Migración VISAS 2026 - Paso 2/3: Visas
-- Crea 60 visas (VISA-0230 a VISA-0289) para los clientes recién insertados.
-- Estado por defecto: EN_PROCESO. País: USA.
-- DS-160 + email solo para Brunella Fiat (datos del 3er PDF).
-- ============================================================================

BEGIN;

-- VISA-0230 → Facundo Ortega
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0230', (SELECT id FROM clientes WHERE gj_id = 'GJ-0231'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0231 → Emilce Agustina Lopez
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0231', (SELECT id FROM clientes WHERE gj_id = 'GJ-0232'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0232 → Matias Serrano Gramajo
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0232', (SELECT id FROM clientes WHERE gj_id = 'GJ-0233'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0233 → Simon Tobias Costilla
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0233', (SELECT id FROM clientes WHERE gj_id = 'GJ-0234'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0234 → Costilla Carlos David
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0234', (SELECT id FROM clientes WHERE gj_id = 'GJ-0235'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0235 → Javier Agustin Hernandez
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0235', (SELECT id FROM clientes WHERE gj_id = 'GJ-0236'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0236 → Matias Ruiz
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0236', (SELECT id FROM clientes WHERE gj_id = 'GJ-0237'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0237 → Martina Diaz
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0237', (SELECT id FROM clientes WHERE gj_id = 'GJ-0238'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0238 → Samir Zehid
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0238', (SELECT id FROM clientes WHERE gj_id = 'GJ-0239'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0239 → Camila Nair Amado
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0239', (SELECT id FROM clientes WHERE gj_id = 'GJ-0240'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0240 → Gonzalo Tabares
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0240', (SELECT id FROM clientes WHERE gj_id = 'GJ-0241'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0241 → Gaspar Jauregui
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0241', (SELECT id FROM clientes WHERE gj_id = 'GJ-0242'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0242 → Josefina Jara
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0242', (SELECT id FROM clientes WHERE gj_id = 'GJ-0243'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0243 → Muhammad Younis Yasin
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0243', (SELECT id FROM clientes WHERE gj_id = 'GJ-0244'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0244 → Amanda Juarez
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0244', (SELECT id FROM clientes WHERE gj_id = 'GJ-0245'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0245 → Daniel Horacio Iñigo
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0245', (SELECT id FROM clientes WHERE gj_id = 'GJ-0246'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0246 → Valentino Iñigo
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0246', (SELECT id FROM clientes WHERE gj_id = 'GJ-0247'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0247 → Agostina Aylen Suero
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0247', (SELECT id FROM clientes WHERE gj_id = 'GJ-0248'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0248 → Santino Tomas Viera
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0248', (SELECT id FROM clientes WHERE gj_id = 'GJ-0249'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0249 → Benjamin Exequiel Amado
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0249', (SELECT id FROM clientes WHERE gj_id = 'GJ-0250'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0250 → Cristina Riquelme
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0250', (SELECT id FROM clientes WHERE gj_id = 'GJ-0251'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0251 → Lucas Gonzalo Depierro
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0251', (SELECT id FROM clientes WHERE gj_id = 'GJ-0252'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0252 → Ezequiel Pedacci
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0252', (SELECT id FROM clientes WHERE gj_id = 'GJ-0253'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0253 → Mariano Colomo
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0253', (SELECT id FROM clientes WHERE gj_id = 'GJ-0254'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0254 → Nacho
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0254', (SELECT id FROM clientes WHERE gj_id = 'GJ-0255'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0255 → Leticia Gimenez
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0255', (SELECT id FROM clientes WHERE gj_id = 'GJ-0256'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0256 → Ignacio Celerino
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0256', (SELECT id FROM clientes WHERE gj_id = 'GJ-0257'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0257 → Fabio Farid Lescano
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0257', (SELECT id FROM clientes WHERE gj_id = 'GJ-0258'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0258 → Santiago Scarione
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0258', (SELECT id FROM clientes WHERE gj_id = 'GJ-0259'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0259 → Tomas Caner
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0259', (SELECT id FROM clientes WHERE gj_id = 'GJ-0260'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0260 → Elian Franco Mayocchi
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0260', (SELECT id FROM clientes WHERE gj_id = 'GJ-0261'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0261 → Sofia Farias
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0261', (SELECT id FROM clientes WHERE gj_id = 'GJ-0262'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0262 → Ignacio Zerda
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0262', (SELECT id FROM clientes WHERE gj_id = 'GJ-0263'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0263 → Leandro Tello
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0263', (SELECT id FROM clientes WHERE gj_id = 'GJ-0264'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0264 → Milagros Veronico Lescano
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0264', (SELECT id FROM clientes WHERE gj_id = 'GJ-0265'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0265 → Jeremias Mauricio Hoyos Muñoz
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0265', (SELECT id FROM clientes WHERE gj_id = 'GJ-0266'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0266 → Sofia Belen Damia
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0266', (SELECT id FROM clientes WHERE gj_id = 'GJ-0267'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0267 → Maria del Rosario Savino
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0267', (SELECT id FROM clientes WHERE gj_id = 'GJ-0268'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0268 → Maria Candelaria Gonzalez
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0268', (SELECT id FROM clientes WHERE gj_id = 'GJ-0269'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0269 → Braian Aguirre
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0269', (SELECT id FROM clientes WHERE gj_id = 'GJ-0270'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0270 → Agustin Moreno
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0270', (SELECT id FROM clientes WHERE gj_id = 'GJ-0271'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0271 → Jeronimo Quiroga
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0271', (SELECT id FROM clientes WHERE gj_id = 'GJ-0272'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0272 → Paz Viviana Merlina
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0272', (SELECT id FROM clientes WHERE gj_id = 'GJ-0273'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0273 → Lopez Noir Sebastian Jose
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0273', (SELECT id FROM clientes WHERE gj_id = 'GJ-0274'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0274 → Nadia Enria
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0274', (SELECT id FROM clientes WHERE gj_id = 'GJ-0275'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0275 → Mariquena Lopez Berra
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0275', (SELECT id FROM clientes WHERE gj_id = 'GJ-0276'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0276 → Maria Belen Davito
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0276', (SELECT id FROM clientes WHERE gj_id = 'GJ-0277'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0277 → Benjamin
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0277', (SELECT id FROM clientes WHERE gj_id = 'GJ-0278'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0278 → Franco Ricardo Aragon
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0278', (SELECT id FROM clientes WHERE gj_id = 'GJ-0279'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0279 → Betina Pioli
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0279', (SELECT id FROM clientes WHERE gj_id = 'GJ-0280'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0280 → Franco Exequiel
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0280', (SELECT id FROM clientes WHERE gj_id = 'GJ-0281'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0281 → Ernesto Andre Zamora Beltran
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0281', (SELECT id FROM clientes WHERE gj_id = 'GJ-0282'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0282 → Gonzalo Jesus Barilari
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0282', (SELECT id FROM clientes WHERE gj_id = 'GJ-0283'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0283 → Bernabe Exequiel Gonzalez
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0283', (SELECT id FROM clientes WHERE gj_id = 'GJ-0284'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0284 → Maria Teresa
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0284', (SELECT id FROM clientes WHERE gj_id = 'GJ-0285'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0285 → Luis Javier
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0285', (SELECT id FROM clientes WHERE gj_id = 'GJ-0286'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0286 → Daniel Fiat
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0286', (SELECT id FROM clientes WHERE gj_id = 'GJ-0287'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0287 → Brunella Fiat (DS-160 + email del 3er PDF)
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0287', (SELECT id FROM clientes WHERE gj_id = 'GJ-0288'), 'AA00FH5EBT', 'danielfiat_@hotmail.com', 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0288 → Sheila Yazmin Jalil
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0288', (SELECT id FROM clientes WHERE gj_id = 'GJ-0289'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0289 → Nico Isa
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0289', (SELECT id FROM clientes WHERE gj_id = 'GJ-0290'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
-- VISA-0290 → Facundo Colin Elias
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, pais_id) VALUES ('VISA-0290', (SELECT id FROM clientes WHERE gj_id = 'GJ-0291'), NULL, NULL, 'EN_PROCESO', (SELECT id FROM paises WHERE codigo_iso = 'USA'));

COMMIT;

-- Verificación
-- SELECT COUNT(*) FROM visas WHERE visa_id BETWEEN 'VISA-0230' AND 'VISA-0290';  -- esperado: 61
