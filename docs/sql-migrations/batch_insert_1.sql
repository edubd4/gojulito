-- GJ-0070: Gonzalo Isaias Gomez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0070', 'Gonzalo Isaias Gomez', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0069', (SELECT id FROM clientes WHERE gj_id = 'GJ-0070'), 'AA00ES5S63', 'gonchiscucu331@gmail.com', 'EN_PROCESO', 34, 'Empleado Legislativo, Brasil y Uruguay, 1.4 millon, Archivista', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'gonzalo123' FROM visas WHERE visa_id = 'VISA-0069';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0070';

-- GJ-0071: Facundo Tula
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0071', 'Facundo Tula', '1994-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0070', (SELECT id FROM clientes WHERE gj_id = 'GJ-0071'), 'AA00ER2N7D', NULL, 'CANCELADA', 30, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0071';

-- GJ-0072: Abel Nacul
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0072', 'Abel Nacul', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0071', (SELECT id FROM clientes WHERE gj_id = 'GJ-0072'), 'AA00ESWU0F', 'naculabel52@gmail.com', 'EN_PROCESO', 39, 'Legislatura Event Planner, Bra y Uru, 1.1 millon', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'abelnacul123' FROM visas WHERE visa_id = 'VISA-0071';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0072';

-- GJ-0073: Juan Pablo Taralo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0073', 'Juan Pablo Taralo', '1982-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0072', (SELECT id FROM clientes WHERE gj_id = 'GJ-0073'), 'AA00ETC1UF', 'juantartalo330@gmail.com', 'EN_PROCESO', 37, 'Deputy Warden y supermercado, Brasil, Uruguay, 8M', '2025-08-28', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'juanpablo123' FROM visas WHERE visa_id = 'VISA-0072';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0073';

-- GJ-0074: Luciano Carrizo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0074', 'Luciano Carrizo', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0073', (SELECT id FROM clientes WHERE gj_id = 'GJ-0074'), 'AA00EUCXOF', 'Carrizoluciano123@gmail.com', 'EN_PROCESO', 49, 'josefina alvarez. NUEVO ds', '2025-12-02', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'baxter123' FROM visas WHERE visa_id = 'VISA-0073';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0074';

-- GJ-0075: Nicolas Arroyo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0075', 'Nicolas Arroyo', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0074', (SELECT id FROM clientes WHERE gj_id = 'GJ-0075'), 'AA00ETLPBX', NULL, 'CANCELADA', 38, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0075';

-- GJ-0076: Albornoz Alvaro Daniel
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0076', 'Albornoz Alvaro Daniel', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0075', (SELECT id FROM clientes WHERE gj_id = 'GJ-0076'), 'AA00ETWZY9', 'alvaro24albornoz@gmail.com', 'CANCELADA', 40, 'EN PAGO Revisar DS en su Chat', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'alvaro123' FROM visas WHERE visa_id = 'VISA-0075';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0076';

-- GJ-0077: Facundo David Pincolini
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0077', 'Facundo David Pincolini', '2001-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0076', (SELECT id FROM clientes WHERE gj_id = 'GJ-0077'), 'AA00F63MN1', 'facundopincolini101@gmail.com', 'APROBADA', 41, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0076';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0077';

-- GJ-0078: Denise Angeles Regueiro
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0078', 'Denise Angeles Regueiro', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0077', (SELECT id FROM clientes WHERE gj_id = 'GJ-0078'), 'AA00ETSEY5', NULL, 'PAUSADA', 42, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0078';

-- GJ-0079: Maria Agostina Vera Paracha
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0079', 'Maria Agostina Vera Paracha', '1996-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0078', (SELECT id FROM clientes WHERE gj_id = 'GJ-0079'), 'AA00ETV71J', 'agosverap@gmail.com', 'EN_PROCESO', 48, 'Legis, Pruductora, Evaristo, 10 anios de anti, 1.1', '2025-07-22', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0078';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0079';

-- GJ-0080: David Nicolas Villasboas Munoz
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0080', 'David Nicolas Villasboas Munoz', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0079', (SELECT id FROM clientes WHERE gj_id = 'GJ-0080'), NULL, NULL, 'PAUSADA', 51, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0080';

-- GJ-0081: Fabricio Fosi Sahian
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0081', 'Fabricio Fosi Sahian', '2005-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0080', (SELECT id FROM clientes WHERE gj_id = 'GJ-0081'), 'AA00EUXMQ9', 'fabricisahian@gmail.com', 'EN_PROCESO', NULL, 'USA LA CUENTA DE SU MADRE', '2025-12-02', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0081';

-- GJ-0082: Gloria Gonzalez Millan (Madre Fosi)
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0082', 'Gloria Gonzalez Millan (Madre Fosi)', '1979-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0081', (SELECT id FROM clientes WHERE gj_id = 'GJ-0082'), 'AA00EVBO33', 'gloriagreciagonzalezmillan@gmail.com', 'EN_PROCESO', NULL, 'Madre de Fabricio Fosi Sahian', '2025-12-02', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'MARIA123' FROM visas WHERE visa_id = 'VISA-0081';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0082';

-- GJ-0083: Nahir Martinez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0083', 'Nahir Martinez', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0082', (SELECT id FROM clientes WHERE gj_id = 'GJ-0083'), 'AA00EUVKY1', 'nahir_martinez09@hotmail.com', 'EN_PROCESO', 1, NULL, '2025-08-22', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0082';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0083';

-- GJ-0084: Camila Jazmin Peretti
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0084', 'Camila Jazmin Peretti', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0083', (SELECT id FROM clientes WHERE gj_id = 'GJ-0084'), 'AA00EUVT31', 'camiperetti@gmail.com', 'TURNO_ASIGNADO', 4, 'Check DS', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0083';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0084';

-- GJ-0085: Matias Ignacio Gomez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0085', 'Matias Ignacio Gomez', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0084', (SELECT id FROM clientes WHERE gj_id = 'GJ-0085'), 'AA00EV1Y3H', 'Matias1832.02@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-10-28', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0084';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0085';

-- GJ-0086: Lucas Figueroa
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0086', 'Lucas Figueroa', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0085', (SELECT id FROM clientes WHERE gj_id = 'GJ-0086'), 'AA00EVBQJ1', NULL, 'EN_PROCESO', 6, 'DS LISTO y confirmado', '2025-10-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0086';

-- GJ-0087: Lucas Figueroa
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0087', 'Lucas Figueroa', '1990-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0086', (SELECT id FROM clientes WHERE gj_id = 'GJ-0087'), 'AA00EVHELH', 'jime_eliza18@hotmail.com', 'EN_PROCESO', 12, 'Check DS', '2025-10-29', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'MARIA123' FROM visas WHERE visa_id = 'VISA-0086';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0087';

-- GJ-0088: David Rodriguez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0088', 'David Rodriguez', '1991-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0087', (SELECT id FROM clientes WHERE gj_id = 'GJ-0088'), 'AA00EVL6ZV', 'drrod85@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0087';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0088';

-- GJ-0089: Elias Moya
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0089', 'Elias Moya', '1992-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0088', (SELECT id FROM clientes WHERE gj_id = 'GJ-0089'), 'AA00EVLH57', 'arielsuarezariel@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-10-28', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0089';

-- GJ-0090: Adrian Gabriel Trillo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0090', 'Adrian Gabriel Trillo', '1991-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0089', (SELECT id FROM clientes WHERE gj_id = 'GJ-0090'), 'AA00EVM3O5', 'adriangabrieltrillo@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0090';

-- GJ-0091: Angel Daniel Bonahora Jaimes
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0091', 'Angel Daniel Bonahora Jaimes', '1985-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0090', (SELECT id FROM clientes WHERE gj_id = 'GJ-0091'), 'AA00EVS07L', 'danybona@hotmail.com', 'EN_PROCESO', NULL, NULL, '2025-11-12', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0090';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0091';

-- GJ-0092: Guadalupe Aybar
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0092', 'Guadalupe Aybar', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0091', (SELECT id FROM clientes WHERE gj_id = 'GJ-0092'), 'AA00EW041N', 'guadaaybar85@gmail.com', 'EN_PROCESO', 7, NULL, '2025-10-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0091';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0092';

-- GJ-0093: Mauricio Jose Daniel Juarez Almeida
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0093', 'Mauricio Jose Daniel Juarez Almeida', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0092', (SELECT id FROM clientes WHERE gj_id = 'GJ-0093'), NULL, 'mauricioalmeida129@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-10-16', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Maurialmeida17' FROM visas WHERE visa_id = 'VISA-0092';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0093';

-- GJ-0094: Dylan Abel Miranda
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0094', 'Dylan Abel Miranda', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0093', (SELECT id FROM clientes WHERE gj_id = 'GJ-0094'), NULL, NULL, 'PAUSADA', NULL, 'wh alemania', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0094';

-- GJ-0095: Ana Agustina Gonzalez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0095', 'Ana Agustina Gonzalez', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0094', (SELECT id FROM clientes WHERE gj_id = 'GJ-0095'), 'AA00EWFOE3', 'anaagustinagonzalez@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-10-08', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0094';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0095';

-- GJ-0096: Tomas Agustin Castaneda
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0096', 'Tomas Agustin Castaneda', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0095', (SELECT id FROM clientes WHERE gj_id = 'GJ-0096'), NULL, NULL, 'PAUSADA', NULL, 'wh alemania', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0096';

-- GJ-0097: Federico Emanuel Triveno
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0097', 'Federico Emanuel Triveno', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0096', (SELECT id FROM clientes WHERE gj_id = 'GJ-0097'), 'AA00EY0X4H', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0097';

-- GJ-0098: Benjamin Landivar
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0098', 'Benjamin Landivar', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0097', (SELECT id FROM clientes WHERE gj_id = 'GJ-0098'), 'AA00EYAICB', 'benjaminlandivar02@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Brendasosa41959839.' FROM visas WHERE visa_id = 'VISA-0097';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0098';

-- GJ-0099: Milagros Trejo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0099', 'Milagros Trejo', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0098', (SELECT id FROM clientes WHERE gj_id = 'GJ-0099'), 'AA00EYALGN', 'milagrostrejo03@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0098';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0099';

-- GJ-0100: Kevin Alexis Maldonado
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0100', 'Kevin Alexis Maldonado', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0099', (SELECT id FROM clientes WHERE gj_id = 'GJ-0100'), 'AA00EYE4VB', 'kmaldonado1602@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0099';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0100';

-- GJ-0101: Brenda Anahi Sosa
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0101', 'Brenda Anahi Sosa', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0100', (SELECT id FROM clientes WHERE gj_id = 'GJ-0101'), 'AA00EYGY5P', 'brendasosa080499@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Diegososa25209627.' FROM visas WHERE visa_id = 'VISA-0100';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0101';

-- GJ-0102: Eva Melany Martinez Paez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0102', 'Eva Melany Martinez Paez', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0101', (SELECT id FROM clientes WHERE gj_id = 'GJ-0102'), 'AA00EZ3HAR', 'evamelanypaez@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-12-11', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Maria123' FROM visas WHERE visa_id = 'VISA-0101';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0102';

-- GJ-0103: Carlos Figueroa
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0103', 'Carlos Figueroa', '1992-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0102', (SELECT id FROM clientes WHERE gj_id = 'GJ-0103'), 'AA00EZ6CFH', 'Lcdo.carlossalazar@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-05', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0102';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0103';

-- GJ-0104: Hernan Chavez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0104', 'Hernan Chavez', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0103', (SELECT id FROM clientes WHERE gj_id = 'GJ-0104'), 'AA00EZTSRH', 'Motomel050@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'maria123' FROM visas WHERE visa_id = 'VISA-0103';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0104';

-- GJ-0105: Sol Daniela Lucero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0105', 'Sol Daniela Lucero', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0104', (SELECT id FROM clientes WHERE gj_id = 'GJ-0105'), 'AA00EZY34X', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0105';

-- GJ-0106: Esteban Gabriel Romero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0106', 'Esteban Gabriel Romero', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0105', (SELECT id FROM clientes WHERE gj_id = 'GJ-0106'), 'AA00F0CD5R', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0106';

-- GJ-0107: Fernanda Anahi Di Franco
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0107', 'Fernanda Anahi Di Franco', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0106', (SELECT id FROM clientes WHERE gj_id = 'GJ-0107'), 'AA00F0CFNZ', 'difrancofernandaa@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0106';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0107';

-- GJ-0108: Sofia Lucero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0108', 'Sofia Lucero', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0107', (SELECT id FROM clientes WHERE gj_id = 'GJ-0108'), 'AA00F0DX3R', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0108';

-- GJ-0109: Diego Nicolas Fernandez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0109', 'Diego Nicolas Fernandez', '1991-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0108', (SELECT id FROM clientes WHERE gj_id = 'GJ-0109'), 'AA00F0FO0T', 'Nicocaballito@live.com', 'EN_PROCESO', NULL, NULL, '2025-12-16', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Fernandezdieg1991.' FROM visas WHERE visa_id = 'VISA-0108';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0109';

