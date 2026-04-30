-- GJ-0230: Santiago Miguel Heredia
INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) VALUES ('GJ-0230', 'Santiago Miguel Heredia', '2003-01-01', 'ACTIVO', 'OTRO');
INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) VALUES ('VISA-0229', (SELECT id FROM clientes WHERE gj_id = 'GJ-0230'), 'AA00FH4WE3', 'santiheredia1888@gmail.com', 'EN_PROCESO', NULL, NULL, NULL, (SELECT id FROM paises WHERE codigo_iso = 'USA'));
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = 'GJ-0230';

COMMIT;
