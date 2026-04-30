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

