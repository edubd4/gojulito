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

