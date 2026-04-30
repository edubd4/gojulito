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

