INSERT INTO public.users (nombres, apellidos, correo, contrasena, tipo, fechaRegistro, "createdAt", "updatedAt") VALUES
('Usuario', 'Prueba', 'usuario@test.com', '$2b$10$LQ7kR4UzZ8kF5pC7P5rJXeBUzNtOJ6A8tFtf0bxEKw9.wh8iOGHmC', 'cliente', CURRENT_DATE, NOW(), NOW()),
('Admin', 'Sistema', 'admin@test.com', '$2b$10$LQ7kR4UzZ8kF5pC7P5rJXeBUzNtOJ6A8tFtf0bxEKw9.wh8iOGHmC', 'admin', CURRENT_DATE, NOW(), NOW()),
('María', 'García', 'maria@test.com', '$2b$10$LQ7kR4UzZ8kF5pC7P5rJXeBUzNtOJ6A8tFtf0bxEKw9.wh8iOGHmC', 'cliente', CURRENT_DATE, NOW(), NOW());

SELECT id, nombres, apellidos, correo, tipo FROM public.users;
