"""
Genera 008_carga_masiva_clientes.sql a partir de los datos del PDF visas-actualizado.pdf.
Ejecutar: py -3 gen_008_carga_masiva.py > 008_carga_masiva_clientes.sql
"""

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def q(s):
    """Escapa string para SQL (single-quote safe)."""
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def fecha(year):
    if year is None:
        return "NULL"
    return q(f"{year}-01-01")

def estado_visa(raw):
    """Mapea el estado del PDF al ENUM estado_visa de la DB."""
    if raw is None:
        return "'EN_PROCESO'"
    r = raw.strip().upper()
    if r in ("OK", "PK", "PAGO", "PAGADO", "CONTROL", "P"):
        return "'EN_PROCESO'"
    if r in ("CONF", "CONFIRMADO"):
        return "'TURNO_ASIGNADO'"
    if r in ("PAUSA", "PAUSADO", "ESPERAR", "NO CONTESTA", "REVISION", "REVISIÓN",
             "NO TIENE PASAPORTE", "CAMBIO PASAPORTE"):
        return "'PAUSADA'"
    if r in ("VENCIDO", "X", "CANCELADO", "CANCELADA"):
        return "'CANCELADA'"
    if r in ("APROB", "APROBADA", "APROBADO"):
        return "'APROBADA'"
    return "'EN_PROCESO'"

def estado_cliente(ev):
    """Si la visa es CANCELADA o PAUSADA el cliente sigue ACTIVO salvo indicación."""
    return "'ACTIVO'"

# ---------------------------------------------------------------------------
# Datos: clientes NUEVOS (no están en DB)
# Formato: (nombre, year_nac, ds160, email, password, ev_raw, orden, notas, fecha_turno)
# ---------------------------------------------------------------------------

NEW_CLIENTS = [
    # GJ-0070
    ("Gonzalo Isaias Gomez", 2000, "AA00ES5S63", "gonchiscucu331@gmail.com", "gonzalo123",
     "OK", 34, "Empleado Legislativo, Brasil y Uruguay, 1.4 millon, Archivista", None),
    # GJ-0071
    ("Facundo Tula", 1994, "AA00ER2N7D", None, None, "X", 30, None, None),
    # GJ-0072
    ("Abel Nacul", 2000, "AA00ESWU0F", "naculabel52@gmail.com", "abelnacul123",
     "OK", 39, "Legislatura Event Planner, Bra y Uru, 1.1 millon", None),
    # GJ-0073
    ("Juan Pablo Taralo", 1982, "AA00ETC1UF", "juantartalo330@gmail.com", "juanpablo123",
     "OK", 37, "Deputy Warden y supermercado, Brasil, Uruguay, 8M", "2025-08-28"),
    # GJ-0074
    ("Luciano Carrizo", 1999, "AA00EUCXOF", "Carrizoluciano123@gmail.com", "baxter123",
     "OK", 49, "josefina alvarez. NUEVO ds", "2025-12-02"),
    # GJ-0075
    ("Nicolas Arroyo", 1995, "AA00ETLPBX", None, None, "X", 38, None, None),
    # GJ-0076
    ("Albornoz Alvaro Daniel", 2004, "AA00ETWZY9", "alvaro24albornoz@gmail.com", "alvaro123",
     "VENCIDO", 40, "EN PAGO Revisar DS en su Chat", None),
    # GJ-0077 - Facundo David Pincolini (usando entrada de pag 3, APROBADA)
    ("Facundo David Pincolini", 2001, "AA00F63MN1", "facundopincolini101@gmail.com", "Leonardosuarez1997.",
     "APROB", 41, None, None),
    # GJ-0078
    ("Denise Angeles Regueiro", 2002, "AA00ETSEY5", None, None, "PAUSA", 42, None, None),
    # GJ-0079
    ("Maria Agostina Vera Paracha", 1996, "AA00ETV71J", "agosverap@gmail.com", "maria123",
     "OK", 48, "Legis, Pruductora, Evaristo, 10 anios de anti, 1.1", "2025-07-22"),
    # GJ-0080
    ("David Nicolas Villasboas Munoz", None, None, None, None, "PAUSA", 51, None, None),
    # GJ-0081
    ("Fabricio Fosi Sahian", 2005, "AA00EUXMQ9", "fabricisahian@gmail.com", None,
     "OK", None, "USA LA CUENTA DE SU MADRE", "2025-12-02"),
    # GJ-0082
    ("Gloria Gonzalez Millan (Madre Fosi)", 1979, "AA00EVBO33",
     "gloriagreciagonzalezmillan@gmail.com", "MARIA123",
     "OK", None, "Madre de Fabricio Fosi Sahian", "2025-12-02"),
    # GJ-0083
    ("Nahir Martinez", 1998, "AA00EUVKY1", "nahir_martinez09@hotmail.com", "maria123",
     "OK", 1, None, "2025-08-22"),
    # GJ-0084
    ("Camila Jazmin Peretti", 1997, "AA00EUVT31", "camiperetti@gmail.com", "maria123",
     "CONF", 4, "Check DS", None),
    # GJ-0085
    ("Matias Ignacio Gomez", 2002, "AA00EV1Y3H", "Matias1832.02@gmail.com", "maria123",
     "OK", None, None, "2025-10-28"),
    # GJ-0086
    ("Lucas Figueroa", 2000, "AA00EVBQJ1", None, None,
     "OK", 6, "DS LISTO y confirmado", "2025-10-06"),
    # GJ-0087 - Lucas Figueroa distinto (1990)
    ("Lucas Figueroa", 1990, "AA00EVHELH", "jime_eliza18@hotmail.com", "MARIA123",
     "OK", 12, "Check DS", "2025-10-29"),
    # GJ-0088
    ("David Rodriguez", 1991, "AA00EVL6ZV", "drrod85@gmail.com", "maria123",
     "PAGO", None, None, None),
    # GJ-0089
    ("Elias Moya", 1992, "AA00EVLH57", "arielsuarezariel@gmail.com", None,
     "OK", None, None, "2025-10-28"),
    # GJ-0090
    ("Adrian Gabriel Trillo", 1991, "AA00EVM3O5", "adriangabrieltrillo@gmail.com", None,
     "OK", None, None, None),
    # GJ-0091
    ("Angel Daniel Bonahora Jaimes", 1985, "AA00EVS07L", "danybona@hotmail.com", "maria123",
     "OK", None, None, "2025-11-12"),
    # GJ-0092
    ("Guadalupe Aybar", 2002, "AA00EW041N", "guadaaybar85@gmail.com", "maria123",
     "OK", 7, None, "2025-10-06"),
    # GJ-0093
    ("Mauricio Jose Daniel Juarez Almeida", 2000, None, "mauricioalmeida129@gmail.com", "Maurialmeida17",
     "OK", None, None, "2025-10-16"),
    # GJ-0094
    ("Dylan Abel Miranda", None, None, None, None, "PAUSA", None, "wh alemania", None),
    # GJ-0095
    ("Ana Agustina Gonzalez", 1998, "AA00EWFOE3", "anaagustinagonzalez@gmail.com", "maria123",
     "OK", None, None, "2025-10-08"),
    # GJ-0096
    ("Tomas Agustin Castaneda", None, None, None, None, "PAUSA", None, "wh alemania", None),
    # GJ-0097
    ("Federico Emanuel Triveno", 1995, "AA00EY0X4H", None, None, "OK", None, None, None),
    # GJ-0098
    ("Benjamin Landivar", 2002, "AA00EYAICB", "benjaminlandivar02@gmail.com", "Brendasosa41959839.",
     "OK", None, None, "2026-01-14"),
    # GJ-0099
    ("Milagros Trejo", 1999, "AA00EYALGN", "milagrostrejo03@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-07"),
    # GJ-0100
    ("Kevin Alexis Maldonado", 2002, "AA00EYE4VB", "kmaldonado1602@gmail.com", "maria123",
     "OK", None, None, "2026-01-07"),
    # GJ-0101
    ("Brenda Anahi Sosa", 1999, "AA00EYGY5P", "brendasosa080499@gmail.com", "Diegososa25209627.",
     "OK", None, None, "2026-01-14"),
    # GJ-0102
    ("Eva Melany Martinez Paez", 1995, "AA00EZ3HAR", "evamelanypaez@gmail.com", "Maria123",
     "OK", None, None, "2025-12-11"),
    # GJ-0103
    ("Carlos Figueroa", 1992, "AA00EZ6CFH", "Lcdo.carlossalazar@gmail.com", "maria123",
     "OK", None, None, "2026-01-05"),
    # GJ-0104
    ("Hernan Chavez", None, "AA00EZTSRH", "Motomel050@gmail.com", "maria123",
     "OK", None, None, None),
    # GJ-0105
    ("Sol Daniela Lucero", 2000, "AA00EZY34X", None, None, "OK", None, None, None),
    # GJ-0106
    ("Esteban Gabriel Romero", 1998, "AA00F0CD5R", None, None, "OK", None, None, None),
    # GJ-0107
    ("Fernanda Anahi Di Franco", 1999, "AA00F0CFNZ", "difrancofernandaa@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-14"),
    # GJ-0108
    ("Sofia Lucero", None, "AA00F0DX3R", None, None, "OK", None, None, None),
    # GJ-0109
    ("Diego Nicolas Fernandez", 1991, "AA00F0FO0T", "Nicocaballito@live.com", "Fernandezdieg1991.",
     "OK", None, None, "2025-12-16"),
    # GJ-0110
    ("Melina Bregni", 2001, "AA00F0NW1L", "melinabregni11@gmail.com", "Melinabregni2001.",
     "PAGO", None, None, None),
    # GJ-0111
    ("Tomas Vila", 2004, "AA00F1AXCX", "tomasvila83@gmail.com", "Tomasagustinvila2004.",
     "OK", None, "Estudiante de contador publico, trabaja en estudio contable familiar", None),
    # GJ-0112
    ("Carlos Moisello", 2003, "AA00F1B8SD", "lisandromoisello7@gmail.com", "Carlosmoseillo2003.",
     "OK", None, None, "2026-01-13"),
    # GJ-0113
    ("Solana Paz Weber", 2000, "AA00F1EMRP", "Solanapazweber02@gmail.com", "Solanapazweber2003.",
     "OK", None, "padre tiene una constructora", "2026-01-15"),
    # GJ-0114
    ("Leonardo Suarez Cortijo", 1997, "AA00F1GSHX", "leonardo-suarez97@hotmail.com", "Leonardosuarez1997.",
     "OK", None, "tiene una propiedad, trabaja en la empresa familiar", "2026-01-07"),
    # GJ-0115
    ("Santiago Gomez", 2003, "AA00F1HATZ", "Sg212763@icloud.com", "planatos",
     "OK", None, None, "2025-10-06"),
    # GJ-0116
    ("Eliana Rossi", 1994, "AA00F1HF3P", "elianarossi.994@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-13"),
    # GJ-0117
    ("Pedro Antonio Batista Arevalo", 1989, "AA00F1JXJN", "batistape19@gmail.com", "BatistaPedro2025.",
     "OK", None, "INICIO LABORAL MARZO 2021", "2025-12-18"),
    # GJ-0118
    ("Maria Julieta Moreno", 1992, "AA00F1K23L", "Morenomariajulieta@gmail.com", "Leonardosuarez1997.",
     "OK", None, "Inicio de trabajo en 2023", "2026-01-07"),
    # GJ-0119
    ("Ramiro Daniel Bustamante", 1997, "AA00F1KEF9", "argiindumentaria10@gmail.com", "Leonardosuarez1997.",
     "OK", None, "Inicio laboral marzo 2021", "2026-01-14"),
    # GJ-0120
    ("Giuliana Romero", 2001, "AA00F1KEFN", "argiindumentaria10@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-14"),
    # GJ-0121
    ("Ignacio Suero", 2004, "AA00F1LFST", None, None, "OK", None, None, "2026-01-20"),
    # GJ-0122
    ("Ana Valentina Arip Juarez", 1998, "AA00F1LDSD", "Valenjuarezarip@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-07"),
    # GJ-0123
    ("Francisco Romirio Carrizo", 2005, "AA00F1LTFJ", "carrizofrancisco416@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-14"),
    # GJ-0124
    ("Esteban Duguech", 2000, "AA00F1LVB9", None, None, "OK", None, None, "2026-01-06"),
    # GJ-0125
    ("Dani Arturo Estigarribia Navarro", 2003, "AA00F1LYNT", "daniinavarro49@gmail.com", "Bernardocafe2007$",
     "OK", None, None, "2026-01-15"),
    # GJ-0126
    ("Priscila Jazmin Fernandez", 2005, "AA00F1LZRT", "prijaz14@gmail.com", "Leonardosuarez1997.",
     "OK", None, "CAMBIAR DS NO TIENE PASAPORTE", None),
    # GJ-0127
    ("Sergio David Cisterna", 2005, "AA00FDKLQ9", None, None,
     "PAGO", None, "CAMBIAR DS NO TIENE PASAPORTE", None),
    # GJ-0128
    ("Ignacio Romero", None, "AA00F1OLLV", None, None, "OK", None, None, None),
    # GJ-0129
    ("Guadalupe Cana", 2003, "AA00F1OOYX", "caguadalupe934@gmail.com", "AAL650319",
     "OK", None, None, None),
    # GJ-0130
    ("Enrique Maximiliano Mamonte", 1997, "AA00F1OSO3", "mamontemaxi@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-07"),
    # GJ-0131
    ("Juan Ignacio Diaz", 2000, "AA00F1OYO3", "id707174@gmail.com", "ruffo2023",
     "OK", None, None, "2026-01-28"),
    # GJ-0132
    ("Florencia Ferrante", 1993, "AA00F1P167", "fflor.ferrante@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2025-12-16"),
    # GJ-0133
    ("Tiziano Julian Huel Roffe", 2004, "AA00F1RIRZ", "tizianohuel7@gmail.com", "rf0ztx3a",
     "OK", None, None, None),
    # GJ-0134
    ("Santiago Gauna", 2000, "AA00FB5F5B", "santigauna4@gmail.com", "Leonardosuarez1997.",
     "OK", None, "no tiene pasaporte", "2025-10-29"),
    # GJ-0135
    ("Cecilia Veronica Bachi", 1974, "AA00F1RYSR", "Ceciliabachi13@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-14"),
    # GJ-0136
    ("Pedro Javier Castillo", 1973, "AA00F1S7RJ", None, None, "OK", None, None, "2026-01-14"),
    # GJ-0137
    ("Federico Duguech", 2003, "AA00F1S9F1", "Fededuguech03@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-06"),
    # GJ-0138
    ("Gabriel Alejandro Avila", 1997, "AA00F1SDQR", "gabrielavilarespaldo@gmail.com", "Leonardosuarez1997.",
     "PAUSA", None, "cambio pasaporte, NO TIENE PASAPORTE", None),
    # GJ-0139
    ("Facundo Maximiliano Sierra", 1995, "AA00F1SLKX", "Facundosierra64@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-02-10"),
    # GJ-0140
    ("Nicolas Cambiasso", 1995, "AA00F26EI5", "nicolas.cambiasso.nc@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-14"),
    # GJ-0141
    ("Luciano Abel Salazar", 1990, "AA00F1SVAR", "marisolmartinez191190@gmail.com", None,
     "OK", None, None, "2026-01-14"),
    # GJ-0142
    ("Marisol Martinez", 1990, "AA00F1XHDD", "marisolmartinez191190@gmail.com", None,
     "OK", None, None, None),
    # GJ-0143
    ("Alma Salazar", None, "AA00F1XQFL", "marisolmartinez191190@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, None),
    # GJ-0144
    ("Patricio Alexandro Soberon", 1996, "AA00F1WNCJ", "patobostero2015@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-05-13"),
    # GJ-0145
    ("Geronimo Jesus Cervera Piorno", 2003, "AA00F1WTY1", "Jesuspiorno754@gmail.com", "2327077544747626GEro.",
     "OK", None, None, "2026-01-15"),
    # GJ-0146
    ("Alvaro Suero", 2006, "AA00F1X0XH", "alvarosuero1@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-20"),
    # GJ-0147
    ("Marcos Facundo Arrieta", 1995, "AA00F279YH", "facoop12@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-05-20"),
    # GJ-0148
    ("Luz Milagros Aliaz de la Rioja", 1999, "AA00F27OTR", "facoop12@gmail.com", None,
     "OK", None, None, None),
    # GJ-0149
    ("Florencia Guadalupe Rute Torres", 1995, "AA00F282VR", "florrutetorres@gmail.com", None,
     "OK", None, None, "2026-01-13"),
    # GJ-0150
    ("Fabricio Ezequiel Gomez", 2000, "AA00F28BPR", "fabriciogomez.amz@gmail.com", "Leonardosuarez1997.",
     "PAGO", None, None, None),
    # GJ-0151
    ("Jorge Leonardo Rivas", 1993, "AA00F27WCL", "Leorivas2393@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-21"),
    # GJ-0152
    ("Lucas Gordillo", 1984, "AA00F27OI5", "Lucasgordillo57@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-06"),
    # GJ-0153
    ("Juan Nahuel Ibanez", 2001, "AA00F2RY91", "Ibaneznahuel11@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-14"),
    # GJ-0154
    ("Roma Ortellado", None, "AA00F2S30L", None, None, "OK", None, None, None),
    # GJ-0155
    ("Lourdes Adriana Torres", 1996, "AA00F2V0P3", "Lulitorres640@gmail.com", "Leonardosuarez1997.",
     "PAGO", None, None, None),
    # GJ-0156
    ("Mayra Belen Royna", 1999, "AA00F37F75", "mayrabelenroyna@gmail.com", None,
     "PAGO", None, None, None),
    # GJ-0157
    ("Gerardo Creche", 1995, "AA00F37IQJ", "Johana21-25@hotmail.com", "johana2024",
     "OK", None, "inicio laboral junio 2021", "2026-01-23"),
    # GJ-0158
    ("Hipolito Constante", 1999, "AA00F3FH0V", "pipoconsta1@gmail.com", "platanos",
     "OK", None, None, "2026-01-07"),
    # GJ-0159
    ("Cristian Dario Montivero", 1995, "AA00F3IBY5", "cmontivero84@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2025-12-29"),
    # GJ-0160
    ("Camila Bargas", 1995, "AA00F3JDYD", "Cami.bargas@hotmail.com", "Leonardosuarez1997.",
     "OK", None, "Segundo formulario: AA00F6IY4D", "2026-03-02"),
    # GJ-0161
    ("Facundo Jose Camarasa", 1996, "AA00F41GGR", "Facu290596@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-02-24"),
    # GJ-0162
    ("Luca Cejas", 1994, "AA00F4G4CB", None, None, "PAUSA", None, "revision", None),
    # GJ-0163
    ("Gabriela Melisa Matos Villalba", 1999, "AA00F4HM1L", "gmmatosv@gmail.com", None,
     "OK", None, "inicio laboral 6 de mayo 2023", "2026-02-26"),
    # GJ-0164
    ("Oscar Arturo Lopez Alfonzo", 1998, None, "oscararturo2010@hotmail.es", None,
     "OK", None, "INICIO 2023", "2026-03-11"),
    # GJ-0165
    ("Mariano Cuezo", 1997, "AA00F4PM31", None, None, "PAUSA", None, None, None),
    # GJ-0166
    ("Isaias Nahuel Juarez", 2001, "AA00F4Q2TB", "Nahueljuarez79@gmail.com", "Nahuel3813490497*",
     "OK", None, None, None),
    # GJ-0167
    ("Franco Nicolas Ferrero", 1994, "AA00F4RRVZ", "franconicolasferrero1794@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-26"),
    # GJ-0168
    ("Maria Cristina Leal", 1958, "AA00F4SDI5", "lealmariacristina33@gmail.com", "Lealmariacristina123!",
     "OK", None, None, "2026-01-13"),
    # GJ-0169
    ("Axel Matteucci", 2007, "AA00F4WHQ5", "axelmatteucci07@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-14"),
    # GJ-0170
    ("Josefina Romero", 1992, "AA00F4WJM1", "jo.romero1@icloud.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-01-29"),
    # GJ-0171
    ("Delfina Romero", None, "AA00F5ETXL", None, None, "OK", None, None, "2026-01-29"),
    # GJ-0172
    ("Facundo Rodriguez Puentes", 2003, "AA00F5NLK7", None, None, "PAGO", None, None, None),
    # GJ-0173
    ("Guadalupe del Rosario Anton", 2002, "AA00F5NP7N", "guadaanton111@gmail.com", None,
     "OK", None, None, None),
    # GJ-0174
    ("Victor Gutierrez", 1995, "AA00F5TYQD", "Victornahuel037@hotmail.com.ar", None,
     "OK", None, "inicio laboral 2021", "2026-01-27"),
    # GJ-0175
    ("Magali Figueroa", 1996, "AA00F5XCF7", None, None, "OK", None, None, "2026-01-27"),
    # GJ-0176
    ("Valeria Sofia Cocha Retiza", 1995, "AA00F63IHV", "valeriasofia.cr@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2025-12-06"),
    # GJ-0177
    ("Hugo Sebastian Mamani", 2002, "AA00F63OLN", "sebastianmamani477@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-02-03"),
    # GJ-0178
    ("Gladys Maria Isabel Venica", 1988, "AA00F6JK87", "isabel_venica89@hotmail.com", "Isabelvenica1989.",
     "OK", None, None, "2026-01-16"),
    # GJ-0179
    ("Emmanuel Galleotti", 1989, "AA00F6JQFV", None, None, "OK", None, None, None),
    # GJ-0180
    ("Carolina Salvo", 2002, "AA00F6XU9T", "salvocarolina4@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2025-12-30"),
    # GJ-0181
    ("Milton Alejandro Satarain", 1997, "AA00F6YZEJ", "jnrsata@gmail.com", "Leonardosuarez1997.",
     "OK", None, "inicio laboral 2017", "2026-02-10"),
    # GJ-0182
    ("Francisco Agustin Perez", 1999, "AA00F716A9", "agustinperez99@icloud.com", "Leonardosuarez1997.",
     "APROB", None, None, None),
    # GJ-0183
    ("Joaquin Geronimo Forquera Yunis", 1999, None, "joaquinfy@gmail.com", None,
     "PAUSA", None, "ESPERAR ENERO", None),
    # GJ-0184
    ("Maximiliano Christian Martinez", 2000, None, "maximartinezagv@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-02-11"),
    # GJ-0185
    ("Bauque Tamara Celeste", 1999, "AA00F7F0YB", "tamibauque@gmail.com", "Malaika42674800@",
     "OK", None, None, "2026-02-11"),
    # GJ-0186
    ("Alejo Daniel Migueli", 2000, "AA00F7HSUH", "miguelialejo@gmail.com", "Malejo27918756..",
     "OK", None, None, "2026-03-10"),
    # GJ-0187
    ("Tomas Uriel Benencia Maccio", 1998, "AA00F7HVIB", "Tomasbenencia18@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-02-10"),
    # GJ-0188
    ("Gianella Abigail Alegre", 2006, "AA00F7RK7X", None, None, "APROB", None, None, "2026-03-10"),
    # GJ-0189
    ("Simon Enoc Roquet", 1998, "AA00F7RTBP", "padinsimon@gmail.com", "Leonardosuarez1997.",
     "OK", None, "Inicio laboral 2017", "2026-04-23"),
    # GJ-0190
    ("Walter Hugo Ferreyra", 1972, "AA00F7UOY1", "capt.walterferreyra@gmail.com", "Leonardosuarez1997.",
     "APROB", None, None, None),
    # GJ-0191
    ("Nilda Elizabeth Aranda", 2003, "AA00F7ZFPJ", "Nildaelizabetharanda48@gmail.com", "Leonardosuarez1997.",
     "OK", None, "inicio estudiantil 2022", "2026-02-06"),
    # GJ-0192
    ("Alexis Flores", None, "AA00F859C5", None, None, "PAUSA", None, "no tiene pasaporte", None),
    # GJ-0193
    ("Joshua Curaratti", 1998, "AA00F85A05", "Joshuacuraratti@gmail.com", None,
     "OK", None, "inicio 2019", "2026-02-20"),
    # GJ-0194
    ("Yuliana Araceli Zanin", 1992, "AA00F8E6YF", "yulianazanin@live.com.ar", "Leonardosuarez1997.",
     "OK", None, "inicio laboral 2013", "2026-02-06"),
    # GJ-0195
    ("Mateo Ruiz Rivero", 2005, "AA00F8ILB1", "ruizmateo142@gmail.com", None,
     "APROB", None, None, "2026-03-10"),
    # GJ-0196
    ("Santiago Thomas Carabajal Rivadeneire", 1998, None, None, None,
     "CANCELADA", None, "cancelado", None),
    # GJ-0197
    ("Jeremias Alejandro Fulco", 2004, "AA00F8IOSH", "Jeremiasfulco7@gmail.com", None,
     "OK", None, None, None),
    # GJ-0198
    ("Marcos David Colla", 2002, "AA00F8IZU1", None, None, "PAUSA", None, "Esperar", None),
    # GJ-0199
    ("Mathias Ezequiel Bassedas", 2002, "AA00F8K6K9", "Mathiasbassedas@gmail.com", "Mathialan99",
     "OK", None, None, None),
    # GJ-0200
    ("Sebastian Perez", 2003, "AA00F8KD5T", "elsebitape22@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-03-20"),
    # GJ-0201
    ("Lucas Uriel Juarez", 2004, "AA00F8KT9V", "lucaas23juarez@gmail.com", "Leonardosuarez1997.",
     "PAGO", None, None, None),
    # GJ-0202
    ("Facundo Alejandro Ceron", 2000, "AA00F8NCBD", "Facuale1@gmail.com", None,
     "OK", None, "inicio 2019", None),
    # GJ-0203
    ("Julio Ivan Villafane", 1995, "AA00F8PHQL", "ivanvillafanie17@gmail.com", "@IvanVillaf37996982",
     "OK", None, None, "2026-03-16"),
    # GJ-0204
    ("Federico Regini", 2004, "AA00F8S3PH", "Reginifederico35@gmail.com", "Leonardosuarez1997.",
     "OK", None, "INICIO 2022", None),
    # GJ-0205
    ("Selene Gimenez Cociffi", 2007, "AA00F8XHF9", "selenegimenez26@gmail.com", None,
     "APROB", None, "inicio 2024", None),
    # GJ-0206
    ("Agostina Chavarria", 2002, "AA00F8YD7H", "onlyagxs111@icloud.com", "Agostina544332",
     "OK", None, "inicio 2021", "2026-01-21"),
    # GJ-0207
    ("Albornoz Albano Martin", 2002, "AA00F9A6U3", "albanoalbornoz32@gmail.com", "Leonardosuarez1997.",
     "APROB", None, None, "2026-01-02"),
    # GJ-0208
    ("Carlos Alberto Torra", 1967, "AA00F9CCYL", None, None, "OK", None, None, "2026-03-02"),
    # GJ-0209
    ("Marcela Jimenez", 1972, "AA00F9CF1D", "Marcelajimenezz1409@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, "2026-03-02"),
    # GJ-0210
    ("Natanael Efrain Leon", 1995, "AA00F9D4DR", "natanaelefrainleon@gmail.com", "Messicampeon2026!",
     "OK", None, "2025", None),
    # GJ-0211
    ("Rodrigo Leonel Alderete", 1999, "AA00F9STUZ", "Leoeltucuuu777@gmail.com", "Leonardosuarez1997.",
     "PAGO", None, "2019", None),
    # GJ-0212
    ("Joel Alejandro De La Rosa", 2004, "AA00FA127D", "delarosajoel322@gmail.com", "Leonardosuarez1997.",
     "OK", None, None, None),
    # GJ-0213
    ("Maria de los Angeles Diaz", 1973, "AA00FB8F2P", "nony_diaz4@hotmail.com", None,
     "APROB", None, None, "2026-03-26"),
    # GJ-0214
    ("Briana Maia Naomi Garnica", 2011, "AA00FB8HX9", None, None,
     "APROB", None, None, "2026-03-26"),
    # GJ-0215
    ("Martha Gladys Altamirano", 1963, "AA00FBMSLJ", "gladismartaaltamirano@gmail.com", None,
     "APROB", None, None, "2026-03-25"),
    # GJ-0216
    ("Ariela Bruno", 1997, "AA00FGCFKV", "arielobruno@gmail.com", None,
     "PAGO", None, None, None),
    # GJ-0217
    ("Alejandro Talamet", 1999, "AA00FC3WSB", "alejandrotamalet@hotmail.com", "qesvip-givme2-rikJax",
     "OK", None, None, "2026-02-25"),
    # GJ-0218
    ("Juan Pablo Gonzalez", 2004, "AA00FD0T8H", "juanpablogonza22@gmail.com", None,
     "OK", None, None, "2026-04-07"),
    # GJ-0219
    ("Yamil Antonio Ciccio", 1992, "AA00FDHRTR", "ventuc2025@gmail.com", None,
     "OK", None, None, "2026-04-30"),
    # GJ-0220
    ("Priscila Jaizon Fernandez", 2005, "AA00FDKG0N", None, None, "PAGO", None, None, None),
    # GJ-0221
    ("Selene Abdala", 2000, "AA00FDXVAT", None, None, "PAGO", None, None, None),
    # GJ-0222
    ("Santiago Ariel Mendez", 2006, "AA00FEJLLX", "santiagomendez1234567890@gmail.com", None,
     "OK", None, None, "2026-03-30"),
    # GJ-0223
    ("Hector Julio Alberto Cardozo", 1989, "AA00FF4HUB", "Cardozo_119@hotmail.com", None,
     "OK", None, None, "2026-04-28"),
    # GJ-0224
    ("Sanchez Zuge Gisela Belen", 2001, "AA00FF4JKF", "zugegiselabelen@gmail.com", None,
     "OK", None, None, "2026-04-22"),
    # GJ-0225
    ("Lautaro Nicolas Isidro Rotta", 2001, "AA00FF7VUF", None, None,
     "OK", None, None, "2026-04-22"),
    # GJ-0226
    ("Benjamin Redel", 2005, "AA00FFDQZR", "Benjaminredel0@gmail.com", None,
     "PAGO", None, None, None),
    # GJ-0227
    ("Angel Ignacio Coronel", 2002, "AA00FG90ON", "ignacoronel2002@gmail.com", None,
     "PAGO", None, None, None),
    # GJ-0228
    ("Juan Antonio Navarro", None, None, None, None, "PAUSA", None, None, None),
    # GJ-0229
    ("Melina Aylen Visintin", 2000, "AA00FH582H", "melivisintin@gmail.com", None,
     "control", None, None, None),
    # GJ-0230
    ("Santiago Miguel Heredia", 2003, "AA00FH4WE3", "santiheredia1888@gmail.com", None,
     "control", None, None, None),
]

# ---------------------------------------------------------------------------
# Datos: clientes EXISTENTES — solo UPDATE de visas (ds160, email, estado, notas)
# Formato: (gj_id, ds160, email_portal, password, ev_raw, notas)
# ---------------------------------------------------------------------------

EXISTING_UPDATES = [
    ("GJ-0004", "AA00FA13DL", None, None, "no contesta", "no contesta"),
    ("GJ-0005", "AA00FB7ANB", "costillasimon449@gmail.com", "$imontobiaS2001*", "OK", None),
    ("GJ-0006", "AA00FBMZ8D", "davidcostilla.98@gmail.com", None, "OK", "inicio 2018"),
    ("GJ-0007", "AA00FB8JJZ", "agushernandez666@gmail.com", None, "OK", None),
    ("GJ-0008", "AA00F9RVJ3", "Matiasruiz327327@gmail.com", None, "OK", "inicio 2013"),
    ("GJ-0009", "AA00FCJGEX", "Martinadiaz22mx@gmail.com", None, "OK", None),
    ("GJ-0010", "AA00F9KB5B", "alelopez2832@gmail.com", None, "OK", "inicio 2015"),
    ("GJ-0011", "AA00FCF2LB", "camiamado13@gmail.com", None, "OK", None),
    ("GJ-0012", "AA00F9VCIB", "tabaresgonzalo3@gmail.com", None, "OK", None),
    ("GJ-0013", "AA00FBB02X", "gasparjh@gmail.com", "Leonardosuarez1997.", "OK", "inicio oct 2023"),
    ("GJ-0014", "AA00FBT03R", "josefinajara598@gmail.com", "Josefinetajara02#", "OK", "inicio 2023"),
    ("GJ-0015", "AA00FBMLGP", "younisyasintop@gmail.com", None, "PAGO", None),
    ("GJ-0016", "AA00FBSX7N", None, None, "OK", None),
    ("GJ-0017", "AA00FBST4Z", "danielinigo38@icloud.com", None, "OK", None),
    ("GJ-0018", "AA00FBSYBX", None, None, "OK", None),
    ("GJ-0019", "AA00FCF0XL", "agosaylens@gmail.com", None, "OK", None),
    ("GJ-0020", "AA00FB7FT9", "Santinoviera860@gmail.com", None, "OK", None),
    ("GJ-0023", "AA00FC1E0V", "luke2508@hotmail.com", None, "PAGO",
     "Desarrollo, optimizacion y administracion de software orientado a ciberseguridad 2024"),
    ("GJ-0024", "AA00FCJ7DR", None, None, "OK", None),
    ("GJ-0025", "AA00FCDW9R", "marianocolomo95@gmail.com", None, "APROB", None),
    ("GJ-0026", "AA00FCD51F", "nachitomozeluk@gmail.com", None, "PAGO", None),
    ("GJ-0027", "AA00FCW5XN", "Leticiaaagimenez@gmail.com", None, "APROB", "inicio 2023"),
    ("GJ-0028", "AA00FCWAGF", "Ignaciofacee@gmail.com", None, "OK", "inicio 2024"),
    ("GJ-0029", "AA00FD96PD", "farid97leskano@gmail.com", None, "APROB", None),
    ("GJ-0031", "AA00FCVETJ", "tom29can@gmail.com", "rytQuv-netzup-gofwe1", "OK", None),
    ("GJ-0032", "AA00FDEKXJ", "elianmayocchi02@gmail.com", None, "APROB", None),
    ("GJ-0033", "AA00FE34J9", "sofiabelenf23@gmail.com", None, "PAUSA", "esperar nov"),
    ("GJ-0035", "AA00FDHQKR", "leandro.tello.98@pomelo.lemonzana.lol", "g3n3r4ls", "APROB", "inicio 2023"),
    ("GJ-0036", "AA00FDF0UT", "milagrosvlescano01@gmail.com", None, "APROB", None),
    ("GJ-0037", None, "jeremiasnale4@gmail.com", None, "OK", "inicio 2024"),
    ("GJ-0038", "AA00FDHO6T", "belendami571@gmail.com", None, "APROB", None),
    ("GJ-0040", "AA00FDONC1", "Gonzalezcandelaria92@gmail.com", "Cande_74visa2026", "OK", None),
    ("GJ-0041", "AA00FDXIYZ", "braiandes13@gmail.com", None, "APROB", None),
    ("GJ-0042", "AA00FE2RCL", "maraaybar15@gmail.com", None, "APROB", None),
    ("GJ-0043", None, "ernestoavalo75@gmail.com", None, "PAUSA", "esperar dinero"),
    ("GJ-0046", "AA00FDKUSF", "Agustinporelmundo@icloud.com", None, "PAGO", None),
    ("GJ-0048", "AA00FE2YRZ", "jeroquiroga1@hotmail.com", "Leonardosuarez1997.", "APROB", None),
    ("GJ-0049", "AA00FECT6D", "vivianamerlinapaz@gmail.com", None, "OK", "inicio 2024"),
    ("GJ-0050", "AA00FEJFZZ", None, None, "OK", "inicio 2021"),
    ("GJ-0051", "AA00FENEED", "nadiaaenria@gmail.com", None, "OK", None),
    ("GJ-0052", "AA00FETYUR", None, None, "OK", None),
    ("GJ-0054", "AA00FF2ULR", "mariquenalopez94@gmail.com", None, "OK", None),
    ("GJ-0055", "AA00FF30SZ", "bdavito31@gmail.com", None, "APROB", None),
    ("GJ-0057", "AA00FFV9YP", "francoaragon842@gmail.com", None, "OK", None),
    ("GJ-0058", "AA00FFNS7N", "betianapioli@gmail.com", "Betiana19170501++", "OK", None),
    ("GJ-0059", "AA00FG8VJT", "francosromano.1994@gmail.com", "Greglaferrere3001!", "PAGO", None),
    ("GJ-0063", "AA00FG8Z0N", "gonzalojesusbarilari@hotmail.com", "Barilarilaprida@221", "PAGO", None),
    ("GJ-0065", "AA00FGR1TF", "bernabeapm@gmail.com", None, "PAGO", None),
    ("GJ-0066", "AA00FGCW2J", None, None, "PAGO", None),
    ("GJ-0067", "AA00FGFBNF", "Ljst380@gmail.com", None, "PAGO", None),
    ("GJ-0068", "AA00FGUV99", "danielfiat_@hotmail.com", None, "control", "inicio 2009"),
]

# ---------------------------------------------------------------------------
# Generador de SQL
# ---------------------------------------------------------------------------

lines = [
    "-- 008_carga_masiva_clientes.sql",
    "-- Generado automáticamente desde visas-actualziado.pdf",
    "-- 161 clientes nuevos (GJ-0070 a GJ-0230) + updates DS-160 de existentes",
    "",
    "BEGIN;",
    "",
    "-- =========================================================",
    "-- 1. UPDATE visas existentes con DS-160, email y estado",
    "-- =========================================================",
    "",
]

for gj_id, ds160, email, password, ev_raw, notas in EXISTING_UPDATES:
    ev = estado_visa(ev_raw)
    set_parts = []
    if ds160:
        set_parts.append(f"ds160 = {q(ds160)}")
    if email:
        set_parts.append(f"email_portal = {q(email)}")
    if ev != "'EN_PROCESO'":  # solo actualizar si cambia
        set_parts.append(f"estado = {ev}")
    if notas:
        set_parts.append(f"notas = {q(notas)}")
    set_parts.append("updated_at = now()")

    if set_parts:
        lines.append(
            f"UPDATE visas SET {', '.join(set_parts)} "
            f"WHERE cliente_id = (SELECT id FROM clientes WHERE gj_id = {q(gj_id)});"
        )

    # Credencial para existentes (si hay password)
    if password:
        lines.append(
            f"INSERT INTO credenciales (visa_id, password_portal) "
            f"SELECT v.id, {q(password)} FROM visas v "
            f"JOIN clientes c ON c.id = v.cliente_id "
            f"WHERE c.gj_id = {q(gj_id)} "
            f"ON CONFLICT (visa_id) DO UPDATE SET password_portal = EXCLUDED.password_portal;"
        )

lines += [
    "",
    "-- =========================================================",
    "-- 2. INSERT clientes nuevos + visas + credenciales",
    "-- =========================================================",
    "",
]

visa_counter = 69  # siguiente es VISA-0069

for i, (nombre, year_nac, ds160, email, password, ev_raw, orden, notas, fecha_turno) in enumerate(NEW_CLIENTS):
    gj_num = 70 + i
    gj_id = f"GJ-{gj_num:04d}"
    visa_num = visa_counter
    visa_counter += 1
    visa_id = f"VISA-{visa_num:04d}"

    ev = estado_visa(ev_raw)

    # INSERT cliente
    lines.append(f"-- {gj_id}: {nombre}")
    lines.append(
        f"INSERT INTO clientes (gj_id, nombre, fecha_nac, estado, canal) "
        f"VALUES ({q(gj_id)}, {q(nombre)}, {fecha(year_nac)}, 'ACTIVO', 'OTRO');"
    )

    # INSERT visa
    email_val = q(email) if email else "NULL"
    ds_val = q(ds160) if ds160 else "NULL"
    orden_val = str(orden) if orden else "NULL"
    notas_val = q(notas) if notas else "NULL"
    turno_val = q(fecha_turno) if fecha_turno else "NULL"

    lines.append(
        f"INSERT INTO visas (visa_id, cliente_id, ds160, email_portal, estado, orden_atencion, notas, fecha_turno, pais_id) "
        f"VALUES ({q(visa_id)}, (SELECT id FROM clientes WHERE gj_id = {q(gj_id)}), "
        f"{ds_val}, {email_val}, {ev}, {orden_val}, {notas_val}, {turno_val}, (SELECT id FROM paises WHERE codigo_iso = 'USA'));"
    )

    # INSERT credencial (si hay password)
    if password:
        lines.append(
            f"INSERT INTO credenciales (visa_id, password_portal) "
            f"SELECT id, {q(password)} FROM visas WHERE visa_id = {q(visa_id)};"
        )

    # INSERT historial
    lines.append(
        f"INSERT INTO historial (cliente_id, visa_id, tipo, descripcion, origen) "
        f"SELECT c.id, v.id, 'NUEVO_CLIENTE', 'Cliente cargado desde planilla PDF', 'sistema' "
        f"FROM clientes c JOIN visas v ON v.cliente_id = c.id WHERE c.gj_id = {q(gj_id)};"
    )
    lines.append("")

lines.append("COMMIT;")
lines.append("")

sql = "\n".join(lines)
import sys
out = open("008_carga_masiva_clientes.sql", "w", encoding="utf-8")
out.write(sql)
out.close()
print(f"OK - {len(lines)} lineas generadas en 008_carga_masiva_clientes.sql")
