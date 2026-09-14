CREATE DATABASE erp_cafeteria;
USE erp_cafeteria;

CREATE TABLE usuario (
	usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    CONSTRAINT chk_usuario_rol
		CHECK(rol IN ('GERENTE', 'TRABAJADOR')),
	estado VARCHAR(20) NOT NULL,
    CONSTRAINT chk_usuario_estado
		CHECK(estado IN('ACTIVO', 'INACTIVO'))
);

CREATE TABLE perfil (
	perfil_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    fecha_contratacion DATE NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT chk_perfil_estado
		CHECK (estado IN ('ACTIVO', 'INACTIVO')),
	CONSTRAINT fk_perfil_usuario
		FOREIGN KEY (usuario_id)
        REFERENCES usuario(usuario_id)
);

CREATE TABLE producto (
	producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_actual INT NOT NULL,
    stock_minimo INT NOT NULL,
    descripcion TEXT NOT NULL,
    imagen VARCHAR(500),
    estado VARCHAR(20) NOT NULL,
	CONSTRAINT chk_producto_estado
		CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

CREATE TABLE proveedor (
	proveedor_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT chk_proveedor_estado
		CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

CREATE TABLE producto_proveedor (
	producto_proveedor_id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    CONSTRAINT uq_producto_proveedor
		UNIQUE (producto_id, proveedor_id),
    CONSTRAINT fk_producto_proveedor_producto
		FOREIGN KEY (producto_id)
        REFERENCES producto(producto_id),
	CONSTRAINT fk_producto_proveedor_proveedor
		FOREIGN KEY (proveedor_id)
        REFERENCES proveedor(proveedor_id)
);

CREATE TABLE venta (
	venta_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    numero_venta VARCHAR(30) UNIQUE,
    fecha_hora DATETIME NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_venta_usuario
		FOREIGN KEY (usuario_id)
        REFERENCES usuario(usuario_id)
);

CREATE TABLE detalle_venta (
	detalle_venta_id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta_venta
		FOREIGN KEY (venta_id)
        REFERENCES venta(venta_id),
	CONSTRAINT fk_detalle_venta_producto
		FOREIGN KEY (producto_id)
        REFERENCES producto(producto_id)
); 

CREATE TABLE factura (
	factura_id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL UNIQUE,
    folio VARCHAR(30) NOT NULL UNIQUE,
    fecha_emision DATETIME NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    nombre_razon_social VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(5) NOT NULL,
    regimen_fiscal VARCHAR(100) NOT NULL,
    uso_factura VARCHAR(255) NOT NULL,
    factura_xml TEXT,
    CONSTRAINT fk_factura_venta
		FOREIGN KEY (venta_id)
        REFERENCES venta(venta_id)
);

CREATE TABLE compra (
	compra_id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_compra_proveedor
		FOREIGN KEY (proveedor_id)
        REFERENCES proveedor(proveedor_id),
	CONSTRAINT fk_compra_usuario
		FOREIGN KEY (usuario_id)
        REFERENCES usuario(usuario_id)
);
    
CREATE TABLE detalle_compra (
	detalle_compra_id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    producto_proveedor_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_compra_producto_proveedor
		FOREIGN KEY (producto_proveedor_id)
		REFERENCES producto_proveedor(producto_proveedor_id),
	CONSTRAINT fk_detalle_compra_compra
		FOREIGN KEY (compra_id)
        REFERENCES compra(compra_id)
);

CREATE TABLE movimiento_financiero (
	movimiento_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    origen VARCHAR(20) NOT NULL,
    referencia_origen VARCHAR(30),
    concepto VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
	subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(30) NULL,
    observaciones TEXT NULL,
    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(usuario_id),
    CONSTRAINT chk_movimiento_tipo
        CHECK (tipo IN ('INGRESO', 'GASTO')),
    CONSTRAINT chk_movimiento_origen
        CHECK (origen IN ('VENTA', 'COMPRA', 'SALARIO', 'MANUAL'))
);

CREATE TABLE horario (
	horario_id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_id INT NOT NULL,
    dia_semana VARCHAR(15) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    CONSTRAINT fk_horario_perfil
		FOREIGN KEY (perfil_id)
        REFERENCES perfil(perfil_id),
	CONSTRAINT uq_horario_perfil_dia
		UNIQUE (perfil_id, dia_semana),
	CONSTRAINT chk_horario_dia_semana
		CHECK (dia_semana IN ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'))
);

CREATE TABLE asistencia (
	asistencia_id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada_registrada TIME NULL,
    hora_salida_registrada TIME NULL,
    estado VARCHAR(20) NOT NULL,
    CONSTRAINT fk_asistencia_perfil
		FOREIGN KEY (perfil_id)
        REFERENCES perfil(perfil_id),
	CONSTRAINT uq_asistencia_perfil_fecha
		UNIQUE (perfil_id, fecha),
	CONSTRAINT chk_asistencia_estado
		CHECK (estado IN ('PRESENTE', 'RETARDO', 'FALTA'))
);

CREATE TABLE pago_salario (
	pago_salario_id INT AUTO_INCREMENT PRIMARY KEY,
    perfil_trabajador_id INT NOT NULL,
    usuario_responsable_id INT NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    fecha_pago DATETIME NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_pago_salario_perfil_trabajador
		FOREIGN KEY (perfil_trabajador_id)
        REFERENCES perfil(perfil_id),
	CONSTRAINT fk_pago_salario_usuario_responsable
		FOREIGN KEY (usuario_responsable_id)
        REFERENCES usuario(usuario_id)
);

-- USUARIOS

INSERT INTO usuario (correo, password_hash, rol, estado)
VALUES
('gerente@savia.com', '1234', 'GERENTE', 'ACTIVO'),
('trabajador@savia.com', '1234', 'TRABAJADOR', 'ACTIVO');


-- PERFILES

INSERT INTO perfil
(usuario_id, nombre, apellidos, telefono, fecha_contratacion, salario, estado)
VALUES
(1, 'Ana', 'Torres', '3312345678', '2024-01-15', 18000.00, 'ACTIVO'),
(2, 'Carlos', 'Ruiz', '3323456789', '2025-02-10', 9500.00, 'ACTIVO');


-- PRODUCTOS

INSERT INTO producto
(nombre, categoria, precio_venta, stock_actual, stock_minimo, descripcion, imagen, estado)
VALUES
('Café Americano', 'Cafés', 45.00, 25, 10, 'Café americano preparado al momento', NULL, 'ACTIVO'),
('Cappuccino', 'Cafés', 65.00, 20, 8, 'Cappuccino con café espresso y leche espumada', NULL, 'ACTIVO'),
('Latte', 'Cafés', 70.00, 18, 8, 'Café espresso preparado con leche', NULL, 'ACTIVO'),
('Té Chai', 'Tés', 60.00, 12, 5, 'Bebida caliente de té chai con leche', NULL, 'ACTIVO'),
('Frappé de Café', 'Bebidas frías', 85.00, 15, 5, 'Bebida fría de café con hielo', NULL, 'ACTIVO'),
('Limonada', 'Bebidas frías', 50.00, 20, 6, 'Limonada natural preparada al momento', NULL, 'ACTIVO'),
('Croissant', 'Panadería', 55.00, 10, 4, 'Croissant horneado', NULL, 'ACTIVO'),
('Cheesecake', 'Postres', 75.00, 8, 4, 'Rebanada de cheesecake', NULL, 'ACTIVO');


-- PROVEEDORES

INSERT INTO proveedor
(nombre, telefono, correo, direccion, estado)
VALUES
('Distribuidora Café del Valle', '3311112233', 'ventas@cafedelvalle.test', 'Av. Vallarta 1500, Guadalajara, Jalisco', 'ACTIVO'),
('Insumos La Estación', '3322223344', 'contacto@laestacion.test', 'Av. México 2200, Guadalajara, Jalisco', 'ACTIVO'),
('Panadería San Miguel', '3333334455', 'pedidos@sanmiguel.test', 'Av. Patria 800, Zapopan, Jalisco', 'ACTIVO');


-- PRODUCTO - PROVEEDOR

INSERT INTO producto_proveedor
(producto_id, proveedor_id, precio_compra)
VALUES
(1, 1, 20.00),
(2, 1, 30.00),
(3, 1, 32.00),
(4, 2, 28.00),
(5, 1, 40.00),
(6, 2, 22.00),
(7, 3, 25.00),
(8, 3, 35.00);


-- VENTAS

INSERT INTO venta
(usuario_id, numero_venta, fecha_hora, subtotal, iva, total)
VALUES
(2, 'V-1', '2026-09-10 10:25:00', 110.00, 17.60, 127.60),
(1, 'V-2', '2026-09-11 16:40:00', 145.00, 23.20, 168.20),
(2, 'V-3', '2026-09-11 18:10:00', 625.00, 100.00, 725.00),
(2, 'V-4', '2026-09-12 09:20:00', 750.00, 120.00, 870.00),
(1, 'V-5', '2026-09-12 11:35:00', 810.00, 129.60, 939.60),
(2, 'V-6', '2026-09-12 14:15:00', 690.00, 110.40, 800.40),
(1, 'V-7', '2026-09-12 17:45:00', 840.00, 134.40, 974.40),
(2, 'V-8', '2026-09-13 09:30:00', 760.00, 121.60, 881.60),
(1, 'V-9', '2026-09-13 12:20:00', 920.00, 147.20, 1067.20),
(2, 'V-10', '2026-09-13 16:10:00', 850.00, 136.00, 986.00);


-- DETALLE DE VENTAS

INSERT INTO detalle_venta
(venta_id, producto_id, cantidad, precio_unitario, subtotal)
VALUES
(1, 1, 1, 45.00, 45.00),
(1, 2, 1, 65.00, 65.00),

(2, 3, 1, 70.00, 70.00),
(2, 8, 1, 75.00, 75.00),

(3, 2, 5, 65.00, 325.00),
(3, 8, 4, 75.00, 300.00),

(4, 8, 10, 75.00, 750.00),

(5, 3, 6, 70.00, 420.00),
(5, 2, 6, 65.00, 390.00),

(6, 4, 6, 60.00, 360.00),
(6, 7, 6, 55.00, 330.00),

(7, 3, 12, 70.00, 840.00),

(8, 4, 10, 60.00, 600.00),
(8, 3, 1, 70.00, 70.00),
(8, 1, 2, 45.00, 90.00),

(9, 5, 10, 85.00, 850.00),
(9, 3, 1, 70.00, 70.00),

(10, 5, 10, 85.00, 850.00);


-- FACTURA

INSERT INTO factura
(venta_id, folio, fecha_emision, rfc, nombre_razon_social, codigo_postal, regimen_fiscal, uso_factura, factura_xml)
VALUES
(
    2,
    'FAC-1',
    '2026-09-11 16:45:00',
    'GODE561231GR8',
    'Cliente de Prueba',
    '45000',
    'Personas Físicas con Actividades Empresariales',
    'Gastos en general',
    '<factura><folio>FAC-1</folio><total>168.20</total></factura>'
);


-- COMPRAS

INSERT INTO compra
(proveedor_id, usuario_id, fecha_hora, subtotal, iva, total)
VALUES
(1, 1, '2026-09-09 09:30:00', 200.00, 32.00, 232.00);


-- DETALLE DE COMPRAS

INSERT INTO detalle_compra
(compra_id, producto_proveedor_id, cantidad, precio_unitario, subtotal)
VALUES
(1, 1, 10, 20.00, 200.00);


-- HORARIOS

INSERT INTO horario
(perfil_id, dia_semana, hora_entrada, hora_salida)
VALUES
(1, 'LUNES', '08:00:00', '16:00:00'),
(1, 'MARTES', '08:00:00', '16:00:00'),
(1, 'MIERCOLES', '08:00:00', '16:00:00'),
(1, 'JUEVES', '08:00:00', '16:00:00'),
(1, 'VIERNES', '08:00:00', '16:00:00'),

(2, 'LUNES', '09:00:00', '17:00:00'),
(2, 'MARTES', '09:00:00', '17:00:00'),
(2, 'MIERCOLES', '09:00:00', '17:00:00'),
(2, 'JUEVES', '09:00:00', '17:00:00'),
(2, 'VIERNES', '09:00:00', '17:00:00');


-- ASISTENCIAS

INSERT INTO asistencia
(perfil_id, fecha, hora_entrada_registrada, hora_salida_registrada, estado)
VALUES
(1, '2026-09-07', '07:58:00', '16:02:00', 'PRESENTE'),
(1, '2026-09-08', '08:10:00', '16:05:00', 'RETARDO'),

(2, '2026-09-07', '08:55:00', '17:03:00', 'PRESENTE'),
(2, '2026-09-08', '09:12:00', '17:05:00', 'RETARDO'),
(2, '2026-09-09', NULL, NULL, 'FALTA');


-- PAGO DE SALARIO

INSERT INTO pago_salario
(perfil_trabajador_id, usuario_responsable_id, periodo_inicio, periodo_fin, fecha_pago, monto)
VALUES
(2, 1, '2026-09-01', '2026-09-15', '2026-09-15 12:00:00', 4750.00);


-- MOVIMIENTOS FINANCIEROS

INSERT INTO movimiento_financiero
(usuario_id, fecha_hora, tipo, origen, referencia_origen, concepto, categoria,
subtotal, iva, total, metodo_pago, observaciones)
VALUES

(1, '2026-09-09 09:30:00',
 'GASTO', 'COMPRA', 'C-1',
 'Compra a Distribuidora Café del Valle', 'COMPRAS',
 200.00, 32.00, 232.00, 'TRANSFERENCIA',
 'Compra de productos para abastecimiento'),

(2, '2026-09-10 10:25:00',
 'INGRESO', 'VENTA', 'V-1',
 'Venta V-1', 'VENTAS',
 110.00, 17.60, 127.60, 'TARJETA',
 'Venta registrada correctamente'),

(1, '2026-09-11 16:40:00',
 'INGRESO', 'VENTA', 'V-2',
 'Venta V-2', 'VENTAS',
 145.00, 23.20, 168.20, 'TARJETA',
 'Venta registrada correctamente'),

(2, '2026-09-11 18:10:00',
 'INGRESO', 'VENTA', 'V-3',
 'Venta V-3', 'VENTAS',
 625.00, 100.00, 725.00, 'EFECTIVO',
 'Venta registrada correctamente'),

(1, '2026-09-12 09:20:00',
 'INGRESO', 'VENTA', 'V-4',
 'Venta V-4', 'VENTAS',
 750.00, 120.00, 870.00, 'TARJETA',
 'Venta registrada correctamente'),

(1, '2026-09-12 11:00:00',
 'GASTO', 'MANUAL', NULL,
 'Compra de productos de limpieza', 'LIMPIEZA',
 500.00, 80.00, 580.00, 'EFECTIVO',
 'Compra de materiales de limpieza para la cafetería'),

(1, '2026-09-12 11:35:00',
 'INGRESO', 'VENTA', 'V-5',
 'Venta V-5', 'VENTAS',
 810.00, 129.60, 939.60, 'TARJETA',
 'Venta registrada correctamente'),

(2, '2026-09-12 14:15:00',
 'INGRESO', 'VENTA', 'V-6',
 'Venta V-6', 'VENTAS',
 690.00, 110.40, 800.40, 'EFECTIVO',
 'Venta registrada correctamente'),

(1, '2026-09-12 17:45:00',
 'INGRESO', 'VENTA', 'V-7',
 'Venta V-7', 'VENTAS',
 840.00, 134.40, 974.40, 'TARJETA',
 'Venta registrada correctamente'),

(2, '2026-09-13 09:30:00',
 'INGRESO', 'VENTA', 'V-8',
 'Venta V-8', 'VENTAS',
 760.00, 121.60, 881.60, 'EFECTIVO',
 'Venta registrada correctamente'),

(1, '2026-09-13 12:20:00',
 'INGRESO', 'VENTA', 'V-9',
 'Venta V-9', 'VENTAS',
 920.00, 147.20, 1067.20, 'TARJETA',
 'Venta registrada correctamente'),

(2, '2026-09-13 16:10:00',
 'INGRESO', 'VENTA', 'V-10',
 'Venta V-10', 'VENTAS',
 850.00, 136.00, 986.00, 'EFECTIVO',
 'Venta registrada correctamente'),

(1, '2026-09-15 12:00:00',
 'GASTO', 'SALARIO', 'PS-1',
 'Pago de salario a Carlos Ruiz', 'SALARIOS',
 4750.00, 0.00, 4750.00, 'TRANSFERENCIA',
 'Pago correspondiente a la primera quincena de septiembre');
