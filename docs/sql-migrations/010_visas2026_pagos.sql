-- Migración VISAS 2026: Pagos (PAG-0001 → PAG-0064)
-- Ejecutar DESPUÉS de 010_visas2026_clientes.sql y 010_visas2026_visas.sql
-- Total esperado: 62 pagos PAGADO/DEUDA + 2 cuotas PENDIENTE de Nico Isa = 64

BEGIN;

-- PAG-0001: Santiago Miguel Heredia (cliente existente GJ-0230)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0001', (SELECT id FROM clientes WHERE gj_id='GJ-0230'), (SELECT id FROM visas WHERE visa_id='VISA-0229'), 'VISA', 200000, '2026-04-09', 'PAGADO', NULL);

-- PAG-0002: Facundo Ortega
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0002', (SELECT id FROM clientes WHERE gj_id='GJ-0231'), (SELECT id FROM visas WHERE visa_id='VISA-0230'), 'VISA', 170000, '2026-01-02', 'PAGADO', 'Grupo: Facundo Ortega + Emilce Agustina Lopez. Total $340k dividido x 2');

-- PAG-0003: Emilce Agustina Lopez
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0003', (SELECT id FROM clientes WHERE gj_id='GJ-0232'), (SELECT id FROM visas WHERE visa_id='VISA-0231'), 'VISA', 170000, '2026-01-02', 'PAGADO', 'Grupo: Facundo Ortega + Emilce Agustina Lopez. Total $340k dividido x 2');

-- PAG-0004: Matias Serrano Gramajo
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0004', (SELECT id FROM clientes WHERE gj_id='GJ-0233'), (SELECT id FROM visas WHERE visa_id='VISA-0232'), 'VISA', 200000, '2026-01-02', 'PAGADO', NULL);

-- PAG-0005: Simon Tobias Costilla
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0005', (SELECT id FROM clientes WHERE gj_id='GJ-0234'), (SELECT id FROM visas WHERE visa_id='VISA-0233'), 'VISA', 100000, '2026-01-16', 'PAGADO', NULL);

-- PAG-0006: Costilla Carlos David
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0006', (SELECT id FROM clientes WHERE gj_id='GJ-0235'), (SELECT id FROM visas WHERE visa_id='VISA-0234'), 'VISA', 200000, '2026-01-16', 'PAGADO', NULL);

-- PAG-0007: Javier Agustin Hernandez
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0007', (SELECT id FROM clientes WHERE gj_id='GJ-0236'), (SELECT id FROM visas WHERE visa_id='VISA-0235'), 'VISA', 200000, '2026-01-16', 'PAGADO', NULL);

-- PAG-0008: Matias Ruiz
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0008', (SELECT id FROM clientes WHERE gj_id='GJ-0237'), (SELECT id FROM visas WHERE visa_id='VISA-0236'), 'VISA', 200000, '2026-01-13', 'PAGADO', NULL);

-- PAG-0009: Martina Diaz
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0009', (SELECT id FROM clientes WHERE gj_id='GJ-0238'), (SELECT id FROM visas WHERE visa_id='VISA-0237'), 'VISA', 200000, '2026-01-15', 'PAGADO', NULL);

-- PAG-0010: Samir Zehid
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0010', (SELECT id FROM clientes WHERE gj_id='GJ-0239'), (SELECT id FROM visas WHERE visa_id='VISA-0238'), 'VISA', 200000, '2026-01-05', 'PAGADO', NULL);

-- PAG-0011: Camila Nair Amado
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0011', (SELECT id FROM clientes WHERE gj_id='GJ-0240'), (SELECT id FROM visas WHERE visa_id='VISA-0239'), 'VISA', 100000, '2026-01-23', 'PAGADO', NULL);

-- PAG-0012: Gonzalo Tabares
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0012', (SELECT id FROM clientes WHERE gj_id='GJ-0241'), (SELECT id FROM visas WHERE visa_id='VISA-0240'), 'VISA', 200000, '2026-01-09', 'PAGADO', NULL);

-- PAG-0013: Gaspar Jauregui
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0013', (SELECT id FROM clientes WHERE gj_id='GJ-0242'), (SELECT id FROM visas WHERE visa_id='VISA-0241'), 'VISA', 200000, '2026-01-27', 'PAGADO', NULL);

-- PAG-0014: Josefina Jara
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0014', (SELECT id FROM clientes WHERE gj_id='GJ-0243'), (SELECT id FROM visas WHERE visa_id='VISA-0242'), 'VISA', 200000, '2026-01-30', 'PAGADO', NULL);

-- PAG-0015: Muhammad Younis Yasin
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0015', (SELECT id FROM clientes WHERE gj_id='GJ-0244'), (SELECT id FROM visas WHERE visa_id='VISA-0243'), 'VISA', 200000, '2026-01-31', 'PAGADO', NULL);

-- PAG-0016: Amanda Juarez (grupo Iñigo x3)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0016', (SELECT id FROM clientes WHERE gj_id='GJ-0245'), (SELECT id FROM visas WHERE visa_id='VISA-0244'), 'VISA', 133333, '2026-01-28', 'PAGADO', 'Grupo: Amanda Juarez + Daniel Iñigo + Valentino Iñigo. Total $400k dividido x 3');

-- PAG-0017: Daniel Horacio Iñigo
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0017', (SELECT id FROM clientes WHERE gj_id='GJ-0246'), (SELECT id FROM visas WHERE visa_id='VISA-0245'), 'VISA', 133333, '2026-01-28', 'PAGADO', 'Grupo: Amanda Juarez + Daniel Iñigo + Valentino Iñigo. Total $400k dividido x 3');

-- PAG-0018: Valentino Iñigo
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0018', (SELECT id FROM clientes WHERE gj_id='GJ-0247'), (SELECT id FROM visas WHERE visa_id='VISA-0246'), 'VISA', 133334, '2026-01-28', 'PAGADO', 'Grupo: Amanda Juarez + Daniel Iñigo + Valentino Iñigo. Total $400k dividido x 3');

-- PAG-0019: Agostina Aylen Suero
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0019', (SELECT id FROM clientes WHERE gj_id='GJ-0248'), (SELECT id FROM visas WHERE visa_id='VISA-0247'), 'VISA', 200000, '2026-01-27', 'PAGADO', NULL);

-- PAG-0020: Santino Tomas Viera (DEUDA)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0020', (SELECT id FROM clientes WHERE gj_id='GJ-0249'), (SELECT id FROM visas WHERE visa_id='VISA-0248'), 'VISA', 0, '2026-01-21', 'DEUDA', 'Deuda completa $200k. No pagó al momento de inscripción');

-- PAG-0021: Benjamin Exequiel Amado (pagaron $300k entre los 2, deben $150k mas)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0021', (SELECT id FROM clientes WHERE gj_id='GJ-0250'), (SELECT id FROM visas WHERE visa_id='VISA-0249'), 'VISA', 150000, '2026-02-02', 'PAGADO', 'Grupo: Benjamin Amado + Cristina Riquelme. Pagaron $300k total ($150k c/u). Deben $150k mas entre los 2. CONTACTADO - No tiene pasaporte, esperamos.');

-- PAG-0022: Cristina Riquelme (pagaron $300k entre los 2, deben $150k mas)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0022', (SELECT id FROM clientes WHERE gj_id='GJ-0251'), (SELECT id FROM visas WHERE visa_id='VISA-0250'), 'VISA', 150000, '2026-02-02', 'PAGADO', 'Grupo: Benjamin Amado + Cristina Riquelme. Pagaron $300k total ($150k c/u). Deben $150k mas entre los 2. CONTACTADO - No tiene pasaporte, esperamos.');

-- PAG-0023: Lucas Gonzalo Depierro
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0023', (SELECT id FROM clientes WHERE gj_id='GJ-0252'), (SELECT id FROM visas WHERE visa_id='VISA-0251'), 'VISA', 200000, '2026-02-04', 'PAGADO', NULL);

-- PAG-0024: Ezequiel Pedacci
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0024', (SELECT id FROM clientes WHERE gj_id='GJ-0253'), (SELECT id FROM visas WHERE visa_id='VISA-0252'), 'VISA', 196000, '2026-02-04', 'PAGADO', 'Grupo: Ezequiel Pedacci + Mariano Colomo. Total $392k dividido x 2');

-- PAG-0025: Mariano Colomo
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0025', (SELECT id FROM clientes WHERE gj_id='GJ-0254'), (SELECT id FROM visas WHERE visa_id='VISA-0253'), 'VISA', 196000, '2026-02-04', 'PAGADO', 'Grupo: Ezequiel Pedacci + Mariano Colomo. Total $392k dividido x 2');

-- PAG-0026: Nacho (apellido pendiente)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0026', (SELECT id FROM clientes WHERE gj_id='GJ-0255'), (SELECT id FROM visas WHERE visa_id='VISA-0254'), 'VISA', 200000, '2026-02-06', 'PAGADO', 'Apellido pendiente de registrar');

-- PAG-0027: Leticia Gimenez
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0027', (SELECT id FROM clientes WHERE gj_id='GJ-0256'), (SELECT id FROM visas WHERE visa_id='VISA-0255'), 'VISA', 150000, '2026-02-10', 'PAGADO', 'Grupo: Leticia Gimenez + Ignacio Celerino. Total $300k dividido x 2');

-- PAG-0028: Ignacio Celerino
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0028', (SELECT id FROM clientes WHERE gj_id='GJ-0257'), (SELECT id FROM visas WHERE visa_id='VISA-0256'), 'VISA', 150000, '2026-02-10', 'PAGADO', 'Grupo: Leticia Gimenez + Ignacio Celerino. Total $300k dividido x 2');

-- PAG-0029: Fabio Farid Lescano
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0029', (SELECT id FROM clientes WHERE gj_id='GJ-0258'), (SELECT id FROM visas WHERE visa_id='VISA-0257'), 'VISA', 160000, '2026-02-15', 'PAGADO', NULL);

-- PAG-0030: Santiago Scarione
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0030', (SELECT id FROM clientes WHERE gj_id='GJ-0259'), (SELECT id FROM visas WHERE visa_id='VISA-0258'), 'VISA', 200000, '2026-02-16', 'PAGADO', NULL);

-- PAG-0031: Tomas Caner
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0031', (SELECT id FROM clientes WHERE gj_id='GJ-0260'), (SELECT id FROM visas WHERE visa_id='VISA-0259'), 'VISA', 200000, '2026-02-16', 'PAGADO', NULL);

-- PAG-0032: Elian Franco Mayocchi
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0032', (SELECT id FROM clientes WHERE gj_id='GJ-0261'), (SELECT id FROM visas WHERE visa_id='VISA-0260'), 'VISA', 200000, '2026-02-19', 'PAGADO', NULL);

-- PAG-0033: Sofia Farias
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0033', (SELECT id FROM clientes WHERE gj_id='GJ-0262'), (SELECT id FROM visas WHERE visa_id='VISA-0261'), 'VISA', 230000, '2026-02-18', 'PAGADO', NULL);

-- PAG-0034: Ignacio Zerda
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0034', (SELECT id FROM clientes WHERE gj_id='GJ-0263'), (SELECT id FROM visas WHERE visa_id='VISA-0262'), 'VISA', 230000, '2026-02-18', 'PAGADO', NULL);

-- PAG-0035: Leandro Tello
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0035', (SELECT id FROM clientes WHERE gj_id='GJ-0264'), (SELECT id FROM visas WHERE visa_id='VISA-0263'), 'VISA', 160000, '2026-02-19', 'PAGADO', 'Grupo: Leandro Tello + Milagros Veronico Lescano. Total $320k dividido x 2');

-- PAG-0036: Milagros Veronico Lescano
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0036', (SELECT id FROM clientes WHERE gj_id='GJ-0265'), (SELECT id FROM visas WHERE visa_id='VISA-0264'), 'VISA', 160000, '2026-02-19', 'PAGADO', 'Grupo: Leandro Tello + Milagros Veronico Lescano. Total $320k dividido x 2');

-- PAG-0037: Jeremias Mauricio Hoyos Muñoz
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0037', (SELECT id FROM clientes WHERE gj_id='GJ-0266'), (SELECT id FROM visas WHERE visa_id='VISA-0265'), 'VISA', 200000, '2026-02-20', 'PAGADO', NULL);

-- PAG-0038: Sofia Belen Damia
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0038', (SELECT id FROM clientes WHERE gj_id='GJ-0267'), (SELECT id FROM visas WHERE visa_id='VISA-0266'), 'VISA', 200000, '2026-02-20', 'PAGADO', NULL);

-- PAG-0039: Maria del Rosario Savino
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0039', (SELECT id FROM clientes WHERE gj_id='GJ-0268'), (SELECT id FROM visas WHERE visa_id='VISA-0267'), 'VISA', 200000, '2026-02-25', 'PAGADO', NULL);

-- PAG-0040: Maria Candelaria Gonzalez
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0040', (SELECT id FROM clientes WHERE gj_id='GJ-0269'), (SELECT id FROM visas WHERE visa_id='VISA-0268'), 'VISA', 200000, '2026-02-24', 'PAGADO', NULL);

-- PAG-0041: Braian Aguirre (cubre Mara Sabrina Aybar + Ernesto Javier Avalo, NO se cargan como clientes)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0041', (SELECT id FROM clientes WHERE gj_id='GJ-0270'), (SELECT id FROM visas WHERE visa_id='VISA-0269'), 'VISA', 500000, '2026-02-27', 'PAGADO', 'Pago cubre 3 personas: Braian Aguirre + Mara Sabrina Aybar + Ernesto Javier Avalo. Total $500k');

-- PAG-0042: Agustin Moreno (paga por amigo sin nombre también)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0042', (SELECT id FROM clientes WHERE gj_id='GJ-0271'), (SELECT id FROM visas WHERE visa_id='VISA-0270'), 'VISA', 240000, '2026-03-02', 'PAGADO', 'Pago incluye amigo sin nombre registrado. Total $240k');

-- PAG-0043: Jeronimo Quiroga
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0043', (SELECT id FROM clientes WHERE gj_id='GJ-0272'), (SELECT id FROM visas WHERE visa_id='VISA-0271'), 'VISA', 200000, '2026-03-05', 'PAGADO', NULL);

-- PAG-0044: Paz Viviana Merlina
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0044', (SELECT id FROM clientes WHERE gj_id='GJ-0273'), (SELECT id FROM visas WHERE visa_id='VISA-0272'), 'VISA', 200000, '2026-03-10', 'PAGADO', NULL);

-- PAG-0045: Lopez Noir Sebastian Jose (DEUDA)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0045', (SELECT id FROM clientes WHERE gj_id='GJ-0274'), (SELECT id FROM visas WHERE visa_id='VISA-0273'), 'VISA', 0, '2026-03-10', 'DEUDA', 'Debe $200k. Paga en abril');

-- PAG-0046: Nadia Enria + Padre + Madre (pagaron $300k total, deben $300k mas)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0046', (SELECT id FROM clientes WHERE gj_id='GJ-0275'), (SELECT id FROM visas WHERE visa_id='VISA-0274'), 'VISA', 300000, '2026-03-10', 'PAGADO', 'Grupo: Nadia Enria + Padre + Madre (sin nombres). Pagaron $300k total ($100k c/u). Deben $300k mas ($100k c/u). Paga Abril. AVISADO.');

-- PAG-0047: Mariquena Lopez Berra
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0047', (SELECT id FROM clientes WHERE gj_id='GJ-0276'), (SELECT id FROM visas WHERE visa_id='VISA-0275'), 'VISA', 300000, '2026-03-17', 'PAGADO', 'Grupo: Mariquena Lopez Berra + Maria Belen Davito. Total $600k dividido x 2');

-- PAG-0048: Maria Belen Davito
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0048', (SELECT id FROM clientes WHERE gj_id='GJ-0277'), (SELECT id FROM visas WHERE visa_id='VISA-0276'), 'VISA', 300000, '2026-03-17', 'PAGADO', 'Grupo: Mariquena Lopez Berra + Maria Belen Davito. Total $600k dividido x 2');

-- PAG-0049: Benjamin (apellido pendiente, debe $100k)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0049', (SELECT id FROM clientes WHERE gj_id='GJ-0278'), (SELECT id FROM visas WHERE visa_id='VISA-0277'), 'VISA', 100000, '2026-03-19', 'PAGADO', 'Pagó $100k, debe $100k. Paga en abril. Apellido pendiente');

-- PAG-0050: Franco Ricardo Aragon
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0050', (SELECT id FROM clientes WHERE gj_id='GJ-0279'), (SELECT id FROM visas WHERE visa_id='VISA-0278'), 'VISA', 160000, '2026-03-18', 'PAGADO', NULL);

-- PAG-0051: Betina Pioli
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0051', (SELECT id FROM clientes WHERE gj_id='GJ-0280'), (SELECT id FROM visas WHERE visa_id='VISA-0279'), 'VISA', 200000, '2026-03-20', 'PAGADO', NULL);

-- PAG-0052: Franco Exequiel
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0052', (SELECT id FROM clientes WHERE gj_id='GJ-0281'), (SELECT id FROM visas WHERE visa_id='VISA-0280'), 'VISA', 160000, '2026-03-27', 'PAGADO', NULL);

-- PAG-0053: Ernesto Andre Zamora Beltran (paga por madre/padre sin nombre)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0053', (SELECT id FROM clientes WHERE gj_id='GJ-0282'), (SELECT id FROM visas WHERE visa_id='VISA-0281'), 'VISA', 400000, '2026-10-13', 'PAGADO', 'Pago incluye familiares sin nombre registrado. Total $400k');

-- PAG-0054: Gonzalo Jesus Barilari (paga por amigo sin nombre)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0054', (SELECT id FROM clientes WHERE gj_id='GJ-0283'), (SELECT id FROM visas WHERE visa_id='VISA-0282'), 'VISA', 400000, '2026-03-26', 'PAGADO', 'Pago incluye amigo sin nombre registrado. Total $400k');

-- PAG-0055: Bernabe Exequiel Gonzalez (debe $40k)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0055', (SELECT id FROM clientes WHERE gj_id='GJ-0284'), (SELECT id FROM visas WHERE visa_id='VISA-0283'), 'VISA', 100000, '2026-03-29', 'PAGADO', 'Pagó $100k, debe $40k pendientes');

-- PAG-0056: Maria Teresa (vinculada a Bernabe)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0056', (SELECT id FROM clientes WHERE gj_id='GJ-0285'), (SELECT id FROM visas WHERE visa_id='VISA-0284'), 'VISA', 100000, '2026-03-30', 'PAGADO', 'Deuda $100k. Vinculada a Bernabe Gonzalez. Apellido pendiente');

-- PAG-0057: Luis Javier (apellido pendiente)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0057', (SELECT id FROM clientes WHERE gj_id='GJ-0286'), (SELECT id FROM visas WHERE visa_id='VISA-0285'), 'VISA', 200000, '2026-03-30', 'PAGADO', 'Apellido pendiente de registrar');

-- PAG-0058: Daniel Fiat
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0058', (SELECT id FROM clientes WHERE gj_id='GJ-0287'), (SELECT id FROM visas WHERE visa_id='VISA-0286'), 'VISA', 100000, '2026-04-08', 'PAGADO', 'Grupo: Daniel Fiat + Brunella Fiat (hija). Total $200k dividido x 2');

-- PAG-0059: Brunella Fiat
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0059', (SELECT id FROM clientes WHERE gj_id='GJ-0288'), (SELECT id FROM visas WHERE visa_id='VISA-0287'), 'VISA', 100000, '2026-04-08', 'PAGADO', 'Grupo: Daniel Fiat + Brunella Fiat (hija). Total $200k dividido x 2');

-- PAG-0060: Sheila Yazmin Jalil
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0060', (SELECT id FROM clientes WHERE gj_id='GJ-0289'), (SELECT id FROM visas WHERE visa_id='VISA-0288'), 'VISA', 200000, '2026-04-11', 'PAGADO', NULL);

-- PAG-0061: Nico Isa cuota 1 PAGADO (financiamiento 3 cuotas)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0061', (SELECT id FROM clientes WHERE gj_id='GJ-0290'), (SELECT id FROM visas WHERE visa_id='VISA-0289'), 'VISA', 149528, '2026-04-16', 'PAGADO', 'Cuota 1/3 financiamiento. Total $448.584 dividido x 3');

-- PAG-0062: Nico Isa cuota 2 PENDIENTE
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0062', (SELECT id FROM clientes WHERE gj_id='GJ-0290'), (SELECT id FROM visas WHERE visa_id='VISA-0289'), 'VISA', 149528, NULL, 'PENDIENTE', 'Cuota 2/3 financiamiento. Total $448.584 dividido x 3');

-- PAG-0063: Nico Isa cuota 3 PENDIENTE
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0063', (SELECT id FROM clientes WHERE gj_id='GJ-0290'), (SELECT id FROM visas WHERE visa_id='VISA-0289'), 'VISA', 149528, NULL, 'PENDIENTE', 'Cuota 3/3 financiamiento. Total $448.584 dividido x 3');

-- PAG-0064: Facundo Colin Elias (novia debe 200k sin nombre)
INSERT INTO pagos (pago_id, cliente_id, visa_id, tipo, monto, fecha_pago, estado, notas) VALUES
  ('PAG-0064', (SELECT id FROM clientes WHERE gj_id='GJ-0291'), (SELECT id FROM visas WHERE visa_id='VISA-0290'), 'VISA', 200000, '2026-04-20', 'PAGADO', 'Pagó $200k. Novia debe $200k (sin nombre registrado, paga aparte)');

-- Historial: registrar pagos en historial
INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen)
SELECT p.cliente_id, p.visa_id, 'PAGO',
  CASE WHEN p.estado = 'PAGADO' THEN 'Pago registrado: $' || p.monto || ' (migración VISAS 2026)'
       WHEN p.estado = 'DEUDA' THEN 'Deuda registrada (migración VISAS 2026): ' || COALESCE(p.notas, '')
       ELSE 'Cuota pendiente (migración VISAS 2026)'
  END, 'sistema'
FROM pagos p
WHERE p.pago_id BETWEEN 'PAG-0001' AND 'PAG-0064';

COMMIT;

-- Verificación
-- SELECT COUNT(*) FROM pagos WHERE pago_id BETWEEN 'PAG-0001' AND 'PAG-0064';  -- esperado: 64
-- SELECT estado, COUNT(*), SUM(monto) FROM pagos WHERE pago_id BETWEEN 'PAG-0001' AND 'PAG-0064' GROUP BY estado;
-- Esperado: PAGADO ~60, DEUDA 2, PENDIENTE 2
