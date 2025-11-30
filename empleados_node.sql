-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 30-11-2025 a las 04:55:05
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_empleados`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nominas`
--

CREATE TABLE `nominas` (
  `id` int(11) NOT NULL,
  `empleado_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `salario_base` decimal(10,2) DEFAULT NULL,
  `bono` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `nominas`
--

INSERT INTO `nominas` (`id`, `empleado_id`, `fecha`, `salario_base`, `bono`, `total`) VALUES
(1, 1, '2025-11-01', 9000.00, 50.00, 9000.00),
(3, 3, '2025-11-01', 8700.00, 200.00, 8700.00),
(4, 4, '2025-11-01', 10000.00, 1000.00, 10000.00),
(5, 5, '2025-11-01', 8900.00, 100.00, 8900.00),
(6, 6, '2025-11-01', 9200.00, 1000.00, 9200.00),
(7, 7, '2025-11-01', 9100.00, 2000.00, 9100.00),
(8, 8, '2025-11-01', 8700.00, 0.00, 8700.00),
(9, 9, '2025-11-01', 9300.00, 0.00, 9300.00),
(10, 10, '2025-11-01', 10500.00, 0.00, 10500.00),
(11, 11, '2025-11-01', 8800.00, 0.00, 8800.00),
(12, 12, '2025-11-01', 9400.00, 0.00, 9400.00),
(13, 13, '2025-11-01', 8600.00, 0.00, 8600.00),
(14, 14, '2025-11-01', 9700.00, 0.00, 9700.00),
(15, 15, '2025-11-01', 8900.00, 0.00, 8900.00),
(16, 16, '2025-11-01', 9100.00, 0.00, 9100.00),
(17, 17, '2025-11-01', 9500.00, 0.00, 9500.00),
(18, 18, '2025-11-01', 8700.00, 0.00, 8700.00),
(19, 19, '2025-11-01', 9300.00, 0.00, 9300.00),
(20, 20, '2025-11-01', 10500.00, 0.00, 10500.00),
(21, 21, '2025-11-01', 8800.00, 0.00, 8800.00),
(22, 22, '2025-11-01', 9400.00, 0.00, 9400.00),
(23, 23, '2025-11-01', 8600.00, 0.00, 8600.00),
(24, 24, '2025-11-01', 9700.00, 0.00, 9700.00),
(25, 25, '2025-11-01', 8900.00, 0.00, 8900.00),
(26, 26, '2025-11-01', 9100.00, 0.00, 9100.00),
(27, 27, '2025-11-01', 9500.00, 0.00, 9500.00),
(28, 28, '2025-11-01', 8700.00, 0.00, 8700.00),
(29, 29, '2025-11-01', 9300.00, 0.00, 9300.00),
(30, 30, '2025-11-01', 10500.00, 0.00, 10500.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `nominas`
--
ALTER TABLE `nominas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nominas_ibfk_1` (`empleado_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `nominas`
--
ALTER TABLE `nominas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `nominas`
--
ALTER TABLE `nominas`
  ADD CONSTRAINT `nominas_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
