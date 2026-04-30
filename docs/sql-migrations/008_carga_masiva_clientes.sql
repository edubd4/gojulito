-- 008_carga_masiva_clientes.sql
-- Generado automáticamente desde visas-actualziado.pdf
-- 161 clientes nuevos (GJ-0070 a GJ-0230) + updates DS-160 de existentes

BEGIN;

-- =========================================================
-- 1. UPDATE visas existentes con DS-160, email y estado
-- =========================================================

UPDATE visas SET ds160 = 'AA00FA13DL', estado = 'PAUSADA', notas = 'no contesta', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0004');
UPDATE visas SET ds160 = 'AA00FB7ANB', email_portal = 'costillasimon449@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0005');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, '$imontobiaS2001*' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0005' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FBMZ8D', email_portal = 'davidcostilla.98@gmail.com', notas = 'inicio 2018', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0006');
UPDATE visas SET ds160 = 'AA00FB8JJZ', email_portal = 'agushernandez666@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0007');
UPDATE visas SET ds160 = 'AA00F9RVJ3', email_portal = 'Matiasruiz327327@gmail.com', notas = 'inicio 2013', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0008');
UPDATE visas SET ds160 = 'AA00FCJGEX', email_portal = 'Martinadiaz22mx@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0009');
UPDATE visas SET ds160 = 'AA00F9KB5B', email_portal = 'alelopez2832@gmail.com', notas = 'inicio 2015', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0010');
UPDATE visas SET ds160 = 'AA00FCF2LB', email_portal = 'camiamado13@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0011');
UPDATE visas SET ds160 = 'AA00F9VCIB', email_portal = 'tabaresgonzalo3@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0012');
UPDATE visas SET ds160 = 'AA00FBB02X', email_portal = 'gasparjh@gmail.com', notas = 'inicio oct 2023', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0013');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'Leonardosuarez1997.' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0013' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FBT03R', email_portal = 'josefinajara598@gmail.com', notas = 'inicio 2023', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0014');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'Josefinetajara02#' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0014' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FBMLGP', email_portal = 'younisyasintop@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0015');
UPDATE visas SET ds160 = 'AA00FBSX7N', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0016');
UPDATE visas SET ds160 = 'AA00FBST4Z', email_portal = 'danielinigo38@icloud.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0017');
UPDATE visas SET ds160 = 'AA00FBSYBX', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0018');
UPDATE visas SET ds160 = 'AA00FCF0XL', email_portal = 'agosaylens@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0019');
UPDATE visas SET ds160 = 'AA00FB7FT9', email_portal = 'Santinoviera860@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0020');
UPDATE visas SET ds160 = 'AA00FC1E0V', email_portal = 'luke2508@hotmail.com', notas = 'Desarrollo, optimizacion y administracion de software orientado a ciberseguridad 2024', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0023');
UPDATE visas SET ds160 = 'AA00FCJ7DR', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0024');
UPDATE visas SET ds160 = 'AA00FCDW9R', email_portal = 'marianocolomo95@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0025');
UPDATE visas SET ds160 = 'AA00FCD51F', email_portal = 'nachitomozeluk@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0026');
UPDATE visas SET ds160 = 'AA00FCW5XN', email_portal = 'Leticiaaagimenez@gmail.com', estado = 'APROBADA', notas = 'inicio 2023', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0027');
UPDATE visas SET ds160 = 'AA00FCWAGF', email_portal = 'Ignaciofacee@gmail.com', notas = 'inicio 2024', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0028');
UPDATE visas SET ds160 = 'AA00FD96PD', email_portal = 'farid97leskano@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0029');
UPDATE visas SET ds160 = 'AA00FCVETJ', email_portal = 'tom29can@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0031');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'rytQuv-netzup-gofwe1' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0031' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FDEKXJ', email_portal = 'elianmayocchi02@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0032');
UPDATE visas SET ds160 = 'AA00FE34J9', email_portal = 'sofiabelenf23@gmail.com', estado = 'PAUSADA', notas = 'esperar nov', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0033');
UPDATE visas SET ds160 = 'AA00FDHQKR', email_portal = 'leandro.tello.98@pomelo.lemonzana.lol', estado = 'APROBADA', notas = 'inicio 2023', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0035');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'g3n3r4ls' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0035' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FDF0UT', email_portal = 'milagrosvlescano01@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0036');
UPDATE visas SET email_portal = 'jeremiasnale4@gmail.com', notas = 'inicio 2024', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0037');
UPDATE visas SET ds160 = 'AA00FDHO6T', email_portal = 'belendami571@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0038');
UPDATE visas SET ds160 = 'AA00FDONC1', email_portal = 'Gonzalezcandelaria92@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0040');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'Cande_74visa2026' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0040' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FDXIYZ', email_portal = 'braiandes13@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0041');
UPDATE visas SET ds160 = 'AA00FE2RCL', email_portal = 'maraaybar15@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0042');
UPDATE visas SET email_portal = 'ernestoavalo75@gmail.com', estado = 'PAUSADA', notas = 'esperar dinero', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0043');
UPDATE visas SET ds160 = 'AA00FDKUSF', email_portal = 'Agustinporelmundo@icloud.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0046');
UPDATE visas SET ds160 = 'AA00FE2YRZ', email_portal = 'jeroquiroga1@hotmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0048');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'Leonardosuarez1997.' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0048' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FECT6D', email_portal = 'vivianamerlinapaz@gmail.com', notas = 'inicio 2024', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0049');
UPDATE visas SET ds160 = 'AA00FEJFZZ', notas = 'inicio 2021', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0050');
UPDATE visas SET ds160 = 'AA00FENEED', email_portal = 'nadiaaenria@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0051');
UPDATE visas SET ds160 = 'AA00FETYUR', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0052');
UPDATE visas SET ds160 = 'AA00FF2ULR', email_portal = 'mariquenalopez94@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0054');
UPDATE visas SET ds160 = 'AA00FF30SZ', email_portal = 'bdavito31@gmail.com', estado = 'APROBADA', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0055');
UPDATE visas SET ds160 = 'AA00FFV9YP', email_portal = 'francoaragon842@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0057');
UPDATE visas SET ds160 = 'AA00FFNS7N', email_portal = 'betianapioli@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0058');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'Betiana19170501++' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0058' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FG8VJT', email_portal = 'francosromano.1994@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0059');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'Greglaferrere3001!' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0059' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FG8Z0N', email_portal = 'gonzalojesusbarilari@hotmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0063');
INSERT INTO credenciales (visa_id, password_portal) SELECT v.id, 'Barilarilaprida@221' FROM visas v JOIN clientes c ON c.id = v.cliente_id WHERE c.gj_id = 'GJ-0063' ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;
UPDATE visas SET ds160 = 'AA00FGR1TF', email_portal = 'bernabeapm@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0065');
UPDATE visas SET ds160 = 'AA00FGCW2J', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0066');
UPDATE visas SET ds160 = 'AA00FGFBNF', email_portal = 'Ljst380@gmail.com', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0067');
UPDATE visas SET ds160 = 'AA00FGUV99', email_portal = 'danielfiat_@hotmail.com', notas = 'inicio 2009', updated_at = now() WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = 'GJ-0068');

-- =========================================================
-- 2. INSERT clientes nuevos + visas + credenciales
-- =========================================================

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

-- GJ-0110: Melina Bregni
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0110', 'Melina Bregni', '2001-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0109', (SELECT id FROM clientes WHERE gj_id = 'GJ-0110'), 'AA00F0NW1L', 'melinabregni11@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Melinabregni2001.' FROM visas WHERE visa_id = 'VISA-0109';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0110';

-- GJ-0111: Tomas Vila
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0111', 'Tomas Vila', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0110', (SELECT id FROM clientes WHERE gj_id = 'GJ-0111'), 'AA00F1AXCX', 'tomasvila83@gmail.com', 'EN_PROCESO', NULL, 'Estudiante de contador publico, trabaja en estudio contable familiar', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Tomasagustinvila2004.' FROM visas WHERE visa_id = 'VISA-0110';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0111';

-- GJ-0112: Carlos Moisello
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0112', 'Carlos Moisello', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0111', (SELECT id FROM clientes WHERE gj_id = 'GJ-0112'), 'AA00F1B8SD', 'lisandromoisello7@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-13', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Carlosmoseillo2003.' FROM visas WHERE visa_id = 'VISA-0111';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0112';

-- GJ-0113: Solana Paz Weber
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0113', 'Solana Paz Weber', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0112', (SELECT id FROM clientes WHERE gj_id = 'GJ-0113'), 'AA00F1EMRP', 'Solanapazweber02@gmail.com', 'EN_PROCESO', NULL, 'padre tiene una constructora', '2026-01-15', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Solanapazweber2003.' FROM visas WHERE visa_id = 'VISA-0112';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0113';

-- GJ-0114: Leonardo Suarez Cortijo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0114', 'Leonardo Suarez Cortijo', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0113', (SELECT id FROM clientes WHERE gj_id = 'GJ-0114'), 'AA00F1GSHX', 'leonardo-suarez97@hotmail.com', 'EN_PROCESO', NULL, 'tiene una propiedad, trabaja en la empresa familiar', '2026-01-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0113';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0114';

-- GJ-0115: Santiago Gomez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0115', 'Santiago Gomez', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0114', (SELECT id FROM clientes WHERE gj_id = 'GJ-0115'), 'AA00F1HATZ', 'Sg212763@icloud.com', 'EN_PROCESO', NULL, NULL, '2025-10-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'planatos' FROM visas WHERE visa_id = 'VISA-0114';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0115';

-- GJ-0116: Eliana Rossi
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0116', 'Eliana Rossi', '1994-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0115', (SELECT id FROM clientes WHERE gj_id = 'GJ-0116'), 'AA00F1HF3P', 'elianarossi.994@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-13', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0115';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0116';

-- GJ-0117: Pedro Antonio Batista Arevalo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0117', 'Pedro Antonio Batista Arevalo', '1989-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0116', (SELECT id FROM clientes WHERE gj_id = 'GJ-0117'), 'AA00F1JXJN', 'batistape19@gmail.com', 'EN_PROCESO', NULL, 'INICIO LABORAL MARZO 2021', '2025-12-18', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'BatistaPedro2025.' FROM visas WHERE visa_id = 'VISA-0116';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0117';

-- GJ-0118: Maria Julieta Moreno
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0118', 'Maria Julieta Moreno', '1992-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0117', (SELECT id FROM clientes WHERE gj_id = 'GJ-0118'), 'AA00F1K23L', 'Morenomariajulieta@gmail.com', 'EN_PROCESO', NULL, 'Inicio de trabajo en 2023', '2026-01-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0117';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0118';

-- GJ-0119: Ramiro Daniel Bustamante
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0119', 'Ramiro Daniel Bustamante', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0118', (SELECT id FROM clientes WHERE gj_id = 'GJ-0119'), 'AA00F1KEF9', 'argiindumentaria10@gmail.com', 'EN_PROCESO', NULL, 'Inicio laboral marzo 2021', '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0118';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0119';

-- GJ-0120: Giuliana Romero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0120', 'Giuliana Romero', '2001-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0119', (SELECT id FROM clientes WHERE gj_id = 'GJ-0120'), 'AA00F1KEFN', 'argiindumentaria10@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0119';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0120';

-- GJ-0121: Ignacio Suero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0121', 'Ignacio Suero', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0120', (SELECT id FROM clientes WHERE gj_id = 'GJ-0121'), 'AA00F1LFST', NULL, 'EN_PROCESO', NULL, NULL, '2026-01-20', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0121';

-- GJ-0122: Ana Valentina Arip Juarez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0122', 'Ana Valentina Arip Juarez', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0121', (SELECT id FROM clientes WHERE gj_id = 'GJ-0122'), 'AA00F1LDSD', 'Valenjuarezarip@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0121';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0122';

-- GJ-0123: Francisco Romirio Carrizo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0123', 'Francisco Romirio Carrizo', '2005-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0122', (SELECT id FROM clientes WHERE gj_id = 'GJ-0123'), 'AA00F1LTFJ', 'carrizofrancisco416@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0122';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0123';

-- GJ-0124: Esteban Duguech
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0124', 'Esteban Duguech', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0123', (SELECT id FROM clientes WHERE gj_id = 'GJ-0124'), 'AA00F1LVB9', NULL, 'EN_PROCESO', NULL, NULL, '2026-01-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0124';

-- GJ-0125: Dani Arturo Estigarribia Navarro
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0125', 'Dani Arturo Estigarribia Navarro', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0124', (SELECT id FROM clientes WHERE gj_id = 'GJ-0125'), 'AA00F1LYNT', 'daniinavarro49@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-15', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Bernardocafe2007$' FROM visas WHERE visa_id = 'VISA-0124';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0125';

-- GJ-0126: Priscila Jazmin Fernandez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0126', 'Priscila Jazmin Fernandez', '2005-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0125', (SELECT id FROM clientes WHERE gj_id = 'GJ-0126'), 'AA00F1LZRT', 'prijaz14@gmail.com', 'EN_PROCESO', NULL, 'CAMBIAR DS NO TIENE PASAPORTE', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0125';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0126';

-- GJ-0127: Sergio David Cisterna
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0127', 'Sergio David Cisterna', '2005-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0126', (SELECT id FROM clientes WHERE gj_id = 'GJ-0127'), 'AA00FDKLQ9', NULL, 'EN_PROCESO', NULL, 'CAMBIAR DS NO TIENE PASAPORTE', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0127';

-- GJ-0128: Ignacio Romero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0128', 'Ignacio Romero', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0127', (SELECT id FROM clientes WHERE gj_id = 'GJ-0128'), 'AA00F1OLLV', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0128';

-- GJ-0129: Guadalupe Cana
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0129', 'Guadalupe Cana', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0128', (SELECT id FROM clientes WHERE gj_id = 'GJ-0129'), 'AA00F1OOYX', 'caguadalupe934@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'AAL650319' FROM visas WHERE visa_id = 'VISA-0128';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0129';

-- GJ-0130: Enrique Maximiliano Mamonte
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0130', 'Enrique Maximiliano Mamonte', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0129', (SELECT id FROM clientes WHERE gj_id = 'GJ-0130'), 'AA00F1OSO3', 'mamontemaxi@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0129';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0130';

-- GJ-0131: Juan Ignacio Diaz
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0131', 'Juan Ignacio Diaz', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0130', (SELECT id FROM clientes WHERE gj_id = 'GJ-0131'), 'AA00F1OYO3', 'id707174@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-28', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'ruffo2023' FROM visas WHERE visa_id = 'VISA-0130';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0131';

-- GJ-0132: Florencia Ferrante
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0132', 'Florencia Ferrante', '1993-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0131', (SELECT id FROM clientes WHERE gj_id = 'GJ-0132'), 'AA00F1P167', 'fflor.ferrante@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-12-16', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0131';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0132';

-- GJ-0133: Tiziano Julian Huel Roffe
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0133', 'Tiziano Julian Huel Roffe', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0132', (SELECT id FROM clientes WHERE gj_id = 'GJ-0133'), 'AA00F1RIRZ', 'tizianohuel7@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'rf0ztx3a' FROM visas WHERE visa_id = 'VISA-0132';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0133';

-- GJ-0134: Santiago Gauna
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0134', 'Santiago Gauna', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0133', (SELECT id FROM clientes WHERE gj_id = 'GJ-0134'), 'AA00FB5F5B', 'santigauna4@gmail.com', 'EN_PROCESO', NULL, 'no tiene pasaporte', '2025-10-29', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0133';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0134';

-- GJ-0135: Cecilia Veronica Bachi
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0135', 'Cecilia Veronica Bachi', '1974-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0134', (SELECT id FROM clientes WHERE gj_id = 'GJ-0135'), 'AA00F1RYSR', 'Ceciliabachi13@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0134';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0135';

-- GJ-0136: Pedro Javier Castillo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0136', 'Pedro Javier Castillo', '1973-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0135', (SELECT id FROM clientes WHERE gj_id = 'GJ-0136'), 'AA00F1S7RJ', NULL, 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0136';

-- GJ-0137: Federico Duguech
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0137', 'Federico Duguech', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0136', (SELECT id FROM clientes WHERE gj_id = 'GJ-0137'), 'AA00F1S9F1', 'Fededuguech03@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0136';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0137';

-- GJ-0138: Gabriel Alejandro Avila
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0138', 'Gabriel Alejandro Avila', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0137', (SELECT id FROM clientes WHERE gj_id = 'GJ-0138'), 'AA00F1SDQR', 'gabrielavilarespaldo@gmail.com', 'PAUSADA', NULL, 'cambio pasaporte, NO TIENE PASAPORTE', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0137';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0138';

-- GJ-0139: Facundo Maximiliano Sierra
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0139', 'Facundo Maximiliano Sierra', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0138', (SELECT id FROM clientes WHERE gj_id = 'GJ-0139'), 'AA00F1SLKX', 'Facundosierra64@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-02-10', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0138';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0139';

-- GJ-0140: Nicolas Cambiasso
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0140', 'Nicolas Cambiasso', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0139', (SELECT id FROM clientes WHERE gj_id = 'GJ-0140'), 'AA00F26EI5', 'nicolas.cambiasso.nc@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0139';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0140';

-- GJ-0141: Luciano Abel Salazar
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0141', 'Luciano Abel Salazar', '1990-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0140', (SELECT id FROM clientes WHERE gj_id = 'GJ-0141'), 'AA00F1SVAR', 'marisolmartinez191190@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0141';

-- GJ-0142: Marisol Martinez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0142', 'Marisol Martinez', '1990-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0141', (SELECT id FROM clientes WHERE gj_id = 'GJ-0142'), 'AA00F1XHDD', 'marisolmartinez191190@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0142';

-- GJ-0143: Alma Salazar
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0143', 'Alma Salazar', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0142', (SELECT id FROM clientes WHERE gj_id = 'GJ-0143'), 'AA00F1XQFL', 'marisolmartinez191190@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0142';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0143';

-- GJ-0144: Patricio Alexandro Soberon
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0144', 'Patricio Alexandro Soberon', '1996-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0143', (SELECT id FROM clientes WHERE gj_id = 'GJ-0144'), 'AA00F1WNCJ', 'patobostero2015@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-05-13', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0143';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0144';

-- GJ-0145: Geronimo Jesus Cervera Piorno
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0145', 'Geronimo Jesus Cervera Piorno', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0144', (SELECT id FROM clientes WHERE gj_id = 'GJ-0145'), 'AA00F1WTY1', 'Jesuspiorno754@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-15', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, '2327077544747626GEro.' FROM visas WHERE visa_id = 'VISA-0144';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0145';

-- GJ-0146: Alvaro Suero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0146', 'Alvaro Suero', '2006-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0145', (SELECT id FROM clientes WHERE gj_id = 'GJ-0146'), 'AA00F1X0XH', 'alvarosuero1@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-20', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0145';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0146';

-- GJ-0147: Marcos Facundo Arrieta
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0147', 'Marcos Facundo Arrieta', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0146', (SELECT id FROM clientes WHERE gj_id = 'GJ-0147'), 'AA00F279YH', 'facoop12@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-05-20', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0146';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0147';

-- GJ-0148: Luz Milagros Aliaz de la Rioja
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0148', 'Luz Milagros Aliaz de la Rioja', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0147', (SELECT id FROM clientes WHERE gj_id = 'GJ-0148'), 'AA00F27OTR', 'facoop12@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0148';

-- GJ-0149: Florencia Guadalupe Rute Torres
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0149', 'Florencia Guadalupe Rute Torres', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0148', (SELECT id FROM clientes WHERE gj_id = 'GJ-0149'), 'AA00F282VR', 'florrutetorres@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-13', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0149';

-- GJ-0150: Fabricio Ezequiel Gomez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0150', 'Fabricio Ezequiel Gomez', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0149', (SELECT id FROM clientes WHERE gj_id = 'GJ-0150'), 'AA00F28BPR', 'fabriciogomez.amz@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0149';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0150';

-- GJ-0151: Jorge Leonardo Rivas
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0151', 'Jorge Leonardo Rivas', '1993-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0150', (SELECT id FROM clientes WHERE gj_id = 'GJ-0151'), 'AA00F27WCL', 'Leorivas2393@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-21', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0150';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0151';

-- GJ-0152: Lucas Gordillo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0152', 'Lucas Gordillo', '1984-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0151', (SELECT id FROM clientes WHERE gj_id = 'GJ-0152'), 'AA00F27OI5', 'Lucasgordillo57@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0151';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0152';

-- GJ-0153: Juan Nahuel Ibanez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0153', 'Juan Nahuel Ibanez', '2001-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0152', (SELECT id FROM clientes WHERE gj_id = 'GJ-0153'), 'AA00F2RY91', 'Ibaneznahuel11@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0152';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0153';

-- GJ-0154: Roma Ortellado
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0154', 'Roma Ortellado', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0153', (SELECT id FROM clientes WHERE gj_id = 'GJ-0154'), 'AA00F2S30L', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0154';

-- GJ-0155: Lourdes Adriana Torres
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0155', 'Lourdes Adriana Torres', '1996-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0154', (SELECT id FROM clientes WHERE gj_id = 'GJ-0155'), 'AA00F2V0P3', 'Lulitorres640@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0154';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0155';

-- GJ-0156: Mayra Belen Royna
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0156', 'Mayra Belen Royna', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0155', (SELECT id FROM clientes WHERE gj_id = 'GJ-0156'), 'AA00F37F75', 'mayrabelenroyna@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0156';

-- GJ-0157: Gerardo Creche
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0157', 'Gerardo Creche', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0156', (SELECT id FROM clientes WHERE gj_id = 'GJ-0157'), 'AA00F37IQJ', 'Johana21-25@hotmail.com', 'EN_PROCESO', NULL, 'inicio laboral junio 2021', '2026-01-23', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'johana2024' FROM visas WHERE visa_id = 'VISA-0156';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0157';

-- GJ-0158: Hipolito Constante
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0158', 'Hipolito Constante', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0157', (SELECT id FROM clientes WHERE gj_id = 'GJ-0158'), 'AA00F3FH0V', 'pipoconsta1@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'platanos' FROM visas WHERE visa_id = 'VISA-0157';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0158';

-- GJ-0159: Cristian Dario Montivero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0159', 'Cristian Dario Montivero', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0158', (SELECT id FROM clientes WHERE gj_id = 'GJ-0159'), 'AA00F3IBY5', 'cmontivero84@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-12-29', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0158';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0159';

-- GJ-0160: Camila Bargas
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0160', 'Camila Bargas', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0159', (SELECT id FROM clientes WHERE gj_id = 'GJ-0160'), 'AA00F3JDYD', 'Cami.bargas@hotmail.com', 'EN_PROCESO', NULL, 'Segundo formulario: AA00F6IY4D', '2026-03-02', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0159';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0160';

-- GJ-0161: Facundo Jose Camarasa
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0161', 'Facundo Jose Camarasa', '1996-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0160', (SELECT id FROM clientes WHERE gj_id = 'GJ-0161'), 'AA00F41GGR', 'Facu290596@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-02-24', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0160';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0161';

-- GJ-0162: Luca Cejas
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0162', 'Luca Cejas', '1994-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0161', (SELECT id FROM clientes WHERE gj_id = 'GJ-0162'), 'AA00F4G4CB', NULL, 'PAUSADA', NULL, 'revision', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0162';

-- GJ-0163: Gabriela Melisa Matos Villalba
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0163', 'Gabriela Melisa Matos Villalba', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0162', (SELECT id FROM clientes WHERE gj_id = 'GJ-0163'), 'AA00F4HM1L', 'gmmatosv@gmail.com', 'EN_PROCESO', NULL, 'inicio laboral 6 de mayo 2023', '2026-02-26', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0163';

-- GJ-0164: Oscar Arturo Lopez Alfonzo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0164', 'Oscar Arturo Lopez Alfonzo', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0163', (SELECT id FROM clientes WHERE gj_id = 'GJ-0164'), NULL, 'oscararturo2010@hotmail.es', 'EN_PROCESO', NULL, 'INICIO 2023', '2026-03-11', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0164';

-- GJ-0165: Mariano Cuezo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0165', 'Mariano Cuezo', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0164', (SELECT id FROM clientes WHERE gj_id = 'GJ-0165'), 'AA00F4PM31', NULL, 'PAUSADA', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0165';

-- GJ-0166: Isaias Nahuel Juarez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0166', 'Isaias Nahuel Juarez', '2001-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0165', (SELECT id FROM clientes WHERE gj_id = 'GJ-0166'), 'AA00F4Q2TB', 'Nahueljuarez79@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Nahuel3813490497*' FROM visas WHERE visa_id = 'VISA-0165';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0166';

-- GJ-0167: Franco Nicolas Ferrero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0167', 'Franco Nicolas Ferrero', '1994-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0166', (SELECT id FROM clientes WHERE gj_id = 'GJ-0167'), 'AA00F4RRVZ', 'franconicolasferrero1794@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-26', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0166';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0167';

-- GJ-0168: Maria Cristina Leal
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0168', 'Maria Cristina Leal', '1958-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0167', (SELECT id FROM clientes WHERE gj_id = 'GJ-0168'), 'AA00F4SDI5', 'lealmariacristina33@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-13', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Lealmariacristina123!' FROM visas WHERE visa_id = 'VISA-0167';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0168';

-- GJ-0169: Axel Matteucci
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0169', 'Axel Matteucci', '2007-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0168', (SELECT id FROM clientes WHERE gj_id = 'GJ-0169'), 'AA00F4WHQ5', 'axelmatteucci07@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-14', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0168';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0169';

-- GJ-0170: Josefina Romero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0170', 'Josefina Romero', '1992-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0169', (SELECT id FROM clientes WHERE gj_id = 'GJ-0170'), 'AA00F4WJM1', 'jo.romero1@icloud.com', 'EN_PROCESO', NULL, NULL, '2026-01-29', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0169';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0170';

-- GJ-0171: Delfina Romero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0171', 'Delfina Romero', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0170', (SELECT id FROM clientes WHERE gj_id = 'GJ-0171'), 'AA00F5ETXL', NULL, 'EN_PROCESO', NULL, NULL, '2026-01-29', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0171';

-- GJ-0172: Facundo Rodriguez Puentes
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0172', 'Facundo Rodriguez Puentes', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0171', (SELECT id FROM clientes WHERE gj_id = 'GJ-0172'), 'AA00F5NLK7', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0172';

-- GJ-0173: Guadalupe del Rosario Anton
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0173', 'Guadalupe del Rosario Anton', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0172', (SELECT id FROM clientes WHERE gj_id = 'GJ-0173'), 'AA00F5NP7N', 'guadaanton111@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0173';

-- GJ-0174: Victor Gutierrez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0174', 'Victor Gutierrez', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0173', (SELECT id FROM clientes WHERE gj_id = 'GJ-0174'), 'AA00F5TYQD', 'Victornahuel037@hotmail.com.ar', 'EN_PROCESO', NULL, 'inicio laboral 2021', '2026-01-27', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0174';

-- GJ-0175: Magali Figueroa
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0175', 'Magali Figueroa', '1996-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0174', (SELECT id FROM clientes WHERE gj_id = 'GJ-0175'), 'AA00F5XCF7', NULL, 'EN_PROCESO', NULL, NULL, '2026-01-27', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0175';

-- GJ-0176: Valeria Sofia Cocha Retiza
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0176', 'Valeria Sofia Cocha Retiza', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0175', (SELECT id FROM clientes WHERE gj_id = 'GJ-0176'), 'AA00F63IHV', 'valeriasofia.cr@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-12-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0175';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0176';

-- GJ-0177: Hugo Sebastian Mamani
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0177', 'Hugo Sebastian Mamani', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0176', (SELECT id FROM clientes WHERE gj_id = 'GJ-0177'), 'AA00F63OLN', 'sebastianmamani477@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-02-03', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0176';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0177';

-- GJ-0178: Gladys Maria Isabel Venica
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0178', 'Gladys Maria Isabel Venica', '1988-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0177', (SELECT id FROM clientes WHERE gj_id = 'GJ-0178'), 'AA00F6JK87', 'isabel_venica89@hotmail.com', 'EN_PROCESO', NULL, NULL, '2026-01-16', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Isabelvenica1989.' FROM visas WHERE visa_id = 'VISA-0177';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0178';

-- GJ-0179: Emmanuel Galleotti
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0179', 'Emmanuel Galleotti', '1989-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0178', (SELECT id FROM clientes WHERE gj_id = 'GJ-0179'), 'AA00F6JQFV', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0179';

-- GJ-0180: Carolina Salvo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0180', 'Carolina Salvo', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0179', (SELECT id FROM clientes WHERE gj_id = 'GJ-0180'), 'AA00F6XU9T', 'salvocarolina4@gmail.com', 'EN_PROCESO', NULL, NULL, '2025-12-30', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0179';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0180';

-- GJ-0181: Milton Alejandro Satarain
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0181', 'Milton Alejandro Satarain', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0180', (SELECT id FROM clientes WHERE gj_id = 'GJ-0181'), 'AA00F6YZEJ', 'jnrsata@gmail.com', 'EN_PROCESO', NULL, 'inicio laboral 2017', '2026-02-10', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0180';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0181';

-- GJ-0182: Francisco Agustin Perez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0182', 'Francisco Agustin Perez', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0181', (SELECT id FROM clientes WHERE gj_id = 'GJ-0182'), 'AA00F716A9', 'agustinperez99@icloud.com', 'APROBADA', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0181';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0182';

-- GJ-0183: Joaquin Geronimo Forquera Yunis
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0183', 'Joaquin Geronimo Forquera Yunis', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0182', (SELECT id FROM clientes WHERE gj_id = 'GJ-0183'), NULL, 'joaquinfy@gmail.com', 'PAUSADA', NULL, 'ESPERAR ENERO', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0183';

-- GJ-0184: Maximiliano Christian Martinez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0184', 'Maximiliano Christian Martinez', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0183', (SELECT id FROM clientes WHERE gj_id = 'GJ-0184'), NULL, 'maximartinezagv@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-02-11', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0183';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0184';

-- GJ-0185: Bauque Tamara Celeste
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0185', 'Bauque Tamara Celeste', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0184', (SELECT id FROM clientes WHERE gj_id = 'GJ-0185'), 'AA00F7F0YB', 'tamibauque@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-02-11', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Malaika42674800@' FROM visas WHERE visa_id = 'VISA-0184';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0185';

-- GJ-0186: Alejo Daniel Migueli
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0186', 'Alejo Daniel Migueli', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0185', (SELECT id FROM clientes WHERE gj_id = 'GJ-0186'), 'AA00F7HSUH', 'miguelialejo@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-03-10', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Malejo27918756..' FROM visas WHERE visa_id = 'VISA-0185';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0186';

-- GJ-0187: Tomas Uriel Benencia Maccio
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0187', 'Tomas Uriel Benencia Maccio', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0186', (SELECT id FROM clientes WHERE gj_id = 'GJ-0187'), 'AA00F7HVIB', 'Tomasbenencia18@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-02-10', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0186';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0187';

-- GJ-0188: Gianella Abigail Alegre
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0188', 'Gianella Abigail Alegre', '2006-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0187', (SELECT id FROM clientes WHERE gj_id = 'GJ-0188'), 'AA00F7RK7X', NULL, 'APROBADA', NULL, NULL, '2026-03-10', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0188';

-- GJ-0189: Simon Enoc Roquet
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0189', 'Simon Enoc Roquet', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0188', (SELECT id FROM clientes WHERE gj_id = 'GJ-0189'), 'AA00F7RTBP', 'padinsimon@gmail.com', 'EN_PROCESO', NULL, 'Inicio laboral 2017', '2026-04-23', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0188';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0189';

-- GJ-0190: Walter Hugo Ferreyra
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0190', 'Walter Hugo Ferreyra', '1972-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0189', (SELECT id FROM clientes WHERE gj_id = 'GJ-0190'), 'AA00F7UOY1', 'capt.walterferreyra@gmail.com', 'APROBADA', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0189';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0190';

-- GJ-0191: Nilda Elizabeth Aranda
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0191', 'Nilda Elizabeth Aranda', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0190', (SELECT id FROM clientes WHERE gj_id = 'GJ-0191'), 'AA00F7ZFPJ', 'Nildaelizabetharanda48@gmail.com', 'EN_PROCESO', NULL, 'inicio estudiantil 2022', '2026-02-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0190';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0191';

-- GJ-0192: Alexis Flores
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0192', 'Alexis Flores', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0191', (SELECT id FROM clientes WHERE gj_id = 'GJ-0192'), 'AA00F859C5', NULL, 'PAUSADA', NULL, 'no tiene pasaporte', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0192';

-- GJ-0193: Joshua Curaratti
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0193', 'Joshua Curaratti', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0192', (SELECT id FROM clientes WHERE gj_id = 'GJ-0193'), 'AA00F85A05', 'Joshuacuraratti@gmail.com', 'EN_PROCESO', NULL, 'inicio 2019', '2026-02-20', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0193';

-- GJ-0194: Yuliana Araceli Zanin
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0194', 'Yuliana Araceli Zanin', '1992-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0193', (SELECT id FROM clientes WHERE gj_id = 'GJ-0194'), 'AA00F8E6YF', 'yulianazanin@live.com.ar', 'EN_PROCESO', NULL, 'inicio laboral 2013', '2026-02-06', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0193';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0194';

-- GJ-0195: Mateo Ruiz Rivero
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0195', 'Mateo Ruiz Rivero', '2005-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0194', (SELECT id FROM clientes WHERE gj_id = 'GJ-0195'), 'AA00F8ILB1', 'ruizmateo142@gmail.com', 'APROBADA', NULL, NULL, '2026-03-10', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0195';

-- GJ-0196: Santiago Thomas Carabajal Rivadeneire
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0196', 'Santiago Thomas Carabajal Rivadeneire', '1998-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0195', (SELECT id FROM clientes WHERE gj_id = 'GJ-0196'), NULL, NULL, 'CANCELADA', NULL, 'cancelado', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0196';

-- GJ-0197: Jeremias Alejandro Fulco
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0197', 'Jeremias Alejandro Fulco', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0196', (SELECT id FROM clientes WHERE gj_id = 'GJ-0197'), 'AA00F8IOSH', 'Jeremiasfulco7@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0197';

-- GJ-0198: Marcos David Colla
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0198', 'Marcos David Colla', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0197', (SELECT id FROM clientes WHERE gj_id = 'GJ-0198'), 'AA00F8IZU1', NULL, 'PAUSADA', NULL, 'Esperar', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0198';

-- GJ-0199: Mathias Ezequiel Bassedas
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0199', 'Mathias Ezequiel Bassedas', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0198', (SELECT id FROM clientes WHERE gj_id = 'GJ-0199'), 'AA00F8K6K9', 'Mathiasbassedas@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Mathialan99' FROM visas WHERE visa_id = 'VISA-0198';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0199';

-- GJ-0200: Sebastian Perez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0200', 'Sebastian Perez', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0199', (SELECT id FROM clientes WHERE gj_id = 'GJ-0200'), 'AA00F8KD5T', 'elsebitape22@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-03-20', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0199';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0200';

-- GJ-0201: Lucas Uriel Juarez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0201', 'Lucas Uriel Juarez', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0200', (SELECT id FROM clientes WHERE gj_id = 'GJ-0201'), 'AA00F8KT9V', 'lucaas23juarez@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0200';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0201';

-- GJ-0202: Facundo Alejandro Ceron
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0202', 'Facundo Alejandro Ceron', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0201', (SELECT id FROM clientes WHERE gj_id = 'GJ-0202'), 'AA00F8NCBD', 'Facuale1@gmail.com', 'EN_PROCESO', NULL, 'inicio 2019', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0202';

-- GJ-0203: Julio Ivan Villafane
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0203', 'Julio Ivan Villafane', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0202', (SELECT id FROM clientes WHERE gj_id = 'GJ-0203'), 'AA00F8PHQL', 'ivanvillafanie17@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-03-16', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, '@IvanVillaf37996982' FROM visas WHERE visa_id = 'VISA-0202';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0203';

-- GJ-0204: Federico Regini
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0204', 'Federico Regini', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0203', (SELECT id FROM clientes WHERE gj_id = 'GJ-0204'), 'AA00F8S3PH', 'Reginifederico35@gmail.com', 'EN_PROCESO', NULL, 'INICIO 2022', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0203';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0204';

-- GJ-0205: Selene Gimenez Cociffi
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0205', 'Selene Gimenez Cociffi', '2007-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0204', (SELECT id FROM clientes WHERE gj_id = 'GJ-0205'), 'AA00F8XHF9', 'selenegimenez26@gmail.com', 'APROBADA', NULL, 'inicio 2024', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0205';

-- GJ-0206: Agostina Chavarria
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0206', 'Agostina Chavarria', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0205', (SELECT id FROM clientes WHERE gj_id = 'GJ-0206'), 'AA00F8YD7H', 'onlyagxs111@icloud.com', 'EN_PROCESO', NULL, 'inicio 2021', '2026-01-21', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Agostina544332' FROM visas WHERE visa_id = 'VISA-0205';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0206';

-- GJ-0207: Albornoz Albano Martin
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0207', 'Albornoz Albano Martin', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0206', (SELECT id FROM clientes WHERE gj_id = 'GJ-0207'), 'AA00F9A6U3', 'albanoalbornoz32@gmail.com', 'APROBADA', NULL, NULL, '2026-01-02', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0206';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0207';

-- GJ-0208: Carlos Alberto Torra
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0208', 'Carlos Alberto Torra', '1967-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0207', (SELECT id FROM clientes WHERE gj_id = 'GJ-0208'), 'AA00F9CCYL', NULL, 'EN_PROCESO', NULL, NULL, '2026-03-02', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0208';

-- GJ-0209: Marcela Jimenez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0209', 'Marcela Jimenez', '1972-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0208', (SELECT id FROM clientes WHERE gj_id = 'GJ-0209'), 'AA00F9CF1D', 'Marcelajimenezz1409@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-03-02', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0208';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0209';

-- GJ-0210: Natanael Efrain Leon
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0210', 'Natanael Efrain Leon', '1995-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0209', (SELECT id FROM clientes WHERE gj_id = 'GJ-0210'), 'AA00F9D4DR', 'natanaelefrainleon@gmail.com', 'EN_PROCESO', NULL, '2025', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Messicampeon2026!' FROM visas WHERE visa_id = 'VISA-0209';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0210';

-- GJ-0211: Rodrigo Leonel Alderete
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0211', 'Rodrigo Leonel Alderete', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0210', (SELECT id FROM clientes WHERE gj_id = 'GJ-0211'), 'AA00F9STUZ', 'Leoeltucuuu777@gmail.com', 'EN_PROCESO', NULL, '2019', NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0210';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0211';

-- GJ-0212: Joel Alejandro De La Rosa
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0212', 'Joel Alejandro De La Rosa', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0211', (SELECT id FROM clientes WHERE gj_id = 'GJ-0212'), 'AA00FA127D', 'delarosajoel322@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'Leonardosuarez1997.' FROM visas WHERE visa_id = 'VISA-0211';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0212';

-- GJ-0213: Maria de los Angeles Diaz
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0213', 'Maria de los Angeles Diaz', '1973-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0212', (SELECT id FROM clientes WHERE gj_id = 'GJ-0213'), 'AA00FB8F2P', 'nony_diaz4@hotmail.com', 'APROBADA', NULL, NULL, '2026-03-26', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0213';

-- GJ-0214: Briana Maia Naomi Garnica
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0214', 'Briana Maia Naomi Garnica', '2011-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0213', (SELECT id FROM clientes WHERE gj_id = 'GJ-0214'), 'AA00FB8HX9', NULL, 'APROBADA', NULL, NULL, '2026-03-26', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0214';

-- GJ-0215: Martha Gladys Altamirano
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0215', 'Martha Gladys Altamirano', '1963-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0214', (SELECT id FROM clientes WHERE gj_id = 'GJ-0215'), 'AA00FBMSLJ', 'gladismartaaltamirano@gmail.com', 'APROBADA', NULL, NULL, '2026-03-25', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0215';

-- GJ-0216: Ariela Bruno
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0216', 'Ariela Bruno', '1997-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0215', (SELECT id FROM clientes WHERE gj_id = 'GJ-0216'), 'AA00FGCFKV', 'arielobruno@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0216';

-- GJ-0217: Alejandro Talamet
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0217', 'Alejandro Talamet', '1999-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0216', (SELECT id FROM clientes WHERE gj_id = 'GJ-0217'), 'AA00FC3WSB', 'alejandrotamalet@hotmail.com', 'EN_PROCESO', NULL, NULL, '2026-02-25', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO credenciales (visa_id, password_portal) SELECT id, 'qesvip-givme2-rikJax' FROM visas WHERE visa_id = 'VISA-0216';
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0217';

-- GJ-0218: Juan Pablo Gonzalez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0218', 'Juan Pablo Gonzalez', '2004-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0217', (SELECT id FROM clientes WHERE gj_id = 'GJ-0218'), 'AA00FD0T8H', 'juanpablogonza22@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-04-07', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0218';

-- GJ-0219: Yamil Antonio Ciccio
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0219', 'Yamil Antonio Ciccio', '1992-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0218', (SELECT id FROM clientes WHERE gj_id = 'GJ-0219'), 'AA00FDHRTR', 'ventuc2025@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-04-30', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0219';

-- GJ-0220: Priscila Jaizon Fernandez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0220', 'Priscila Jaizon Fernandez', '2005-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0219', (SELECT id FROM clientes WHERE gj_id = 'GJ-0220'), 'AA00FDKG0N', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0220';

-- GJ-0221: Selene Abdala
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0221', 'Selene Abdala', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0220', (SELECT id FROM clientes WHERE gj_id = 'GJ-0221'), 'AA00FDXVAT', NULL, 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0221';

-- GJ-0222: Santiago Ariel Mendez
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0222', 'Santiago Ariel Mendez', '2006-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0221', (SELECT id FROM clientes WHERE gj_id = 'GJ-0222'), 'AA00FEJLLX', 'santiagomendez1234567890@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-03-30', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0222';

-- GJ-0223: Hector Julio Alberto Cardozo
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0223', 'Hector Julio Alberto Cardozo', '1989-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0222', (SELECT id FROM clientes WHERE gj_id = 'GJ-0223'), 'AA00FF4HUB', 'Cardozo_119@hotmail.com', 'EN_PROCESO', NULL, NULL, '2026-04-28', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0223';

-- GJ-0224: Sanchez Zuge Gisela Belen
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0224', 'Sanchez Zuge Gisela Belen', '2001-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0223', (SELECT id FROM clientes WHERE gj_id = 'GJ-0224'), 'AA00FF4JKF', 'zugegiselabelen@gmail.com', 'EN_PROCESO', NULL, NULL, '2026-04-22', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0224';

-- GJ-0225: Lautaro Nicolas Isidro Rotta
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0225', 'Lautaro Nicolas Isidro Rotta', '2001-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0224', (SELECT id FROM clientes WHERE gj_id = 'GJ-0225'), 'AA00FF7VUF', NULL, 'EN_PROCESO', NULL, NULL, '2026-04-22', (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0225';

-- GJ-0226: Benjamin Redel
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0226', 'Benjamin Redel', '2005-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0225', (SELECT id FROM clientes WHERE gj_id = 'GJ-0226'), 'AA00FFDQZR', 'Benjaminredel0@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0226';

-- GJ-0227: Angel Ignacio Coronel
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0227', 'Angel Ignacio Coronel', '2002-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0226', (SELECT id FROM clientes WHERE gj_id = 'GJ-0227'), 'AA00FG90ON', 'ignacoronel2002@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0227';

-- GJ-0228: Juan Antonio Navarro
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0228', 'Juan Antonio Navarro', NULL, 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0227', (SELECT id FROM clientes WHERE gj_id = 'GJ-0228'), NULL, NULL, 'PAUSADA', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0228';

-- GJ-0229: Melina Aylen Visintin
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0229', 'Melina Aylen Visintin', '2000-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0228', (SELECT id FROM clientes WHERE gj_id = 'GJ-0229'), 'AA00FH582H', 'melivisintin@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0229';

-- GJ-0230: Santiago Miguel Heredia
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0230', 'Santiago Miguel Heredia', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0229', (SELECT id FROM clientes WHERE gj_id = 'GJ-0230'), 'AA00FH4WE3', 'santiheredia1888@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0230';

COMMIT;
