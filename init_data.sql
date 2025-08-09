-- Limpiar y recrear datos
TRUNCATE TABLE public.products RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;

-- Insertar productos
INSERT INTO public.products (id, title, price, image, description, surprise, category, "createdAt", "updatedAt") VALUES
(1, 'Beso Infinito 💋', 'Gratis, porque ya eres mía 😘', '/romantic-kiss-lips-heart.png', 'Válido por besos ilimitados cada vez que sonrías', 'Este cupón te da derecho a besos infinitos, abrazos eternos y sonrisas que nunca se acaban. Cada vez que me mires, recibirás uno gratis. ¡Sin fecha de vencimiento! 💕', 'Amor', NOW(), NOW()),
(2, 'Mi Amor Eterno 🥰', 'Invaluable', '/eternal-love-infinity.png', 'Nunca se agota, no caduca, y siempre crece contigo', 'Mi amor por ti es como el universo: infinito, en constante expansión y lleno de maravillas por descubrir. Cada día que pasa, crece más y más. ❤️✨', 'Sentimientos', NOW(), NOW()),
(3, 'Nuestra Canción 🎵', 'Incluida con el amor', '/romantic-music-notes.png', 'Reproduce un audio especial para ustedes', '🎶 Cada vez que escucho esta canción, pienso en ti. Es nuestra melodía, la banda sonora de nuestro amor. Que suene siempre en nuestros corazones. 🎵💕', 'Recuerdos', NOW(), NOW()),
(4, 'Recuerdo Favorito 📸', 'Irremplazable', '/romantic-couple-memory.png', 'Galería con fotos o momentos especiales', 'Cada foto contigo es un tesoro. Cada momento juntos es una página de nuestra historia de amor. Estos recuerdos son mi mayor riqueza. 📷💖', 'Recuerdos', NOW(), NOW()),
(5, 'Carta Secreta 💌', 'Solo para ti', '/love-letter-heart.png', 'Una carta romántica, escrita por ti', 'Mi querida amor, cada palabra que escribo para ti sale directamente de mi corazón. Eres mi inspiración, mi musa, mi todo. Te amo más de lo que las palabras pueden expresar. 💕📝', 'Mensajes', NOW(), NOW()),
(6, 'Sorpresa Misteriosa 🎁', 'Tú decides', '/romantic-mystery-gift.png', 'Un link a un video dedicado, collage o poema', '¡Sorpresa! Esta caja contiene todos mis sueños contigo, mis planes para nuestro futuro y una promesa: siempre haré todo lo posible por verte sonreír. 🎉💝', 'Sorpresas', NOW(), NOW());

-- Insertar usuarios de prueba
INSERT INTO public.users (id, name, lastName, email, password, type, "createdAt", "updatedAt") VALUES
(1, 'Usuario', 'Prueba', 'usuario@test.com', '$2b$10$LQ7kR4UzZ8kF5pC7P5rJXeBUzNtOJ6A8tFtf0bxEKw9.wh8iOGHmC', 'user', NOW(), NOW()),
(2, 'Admin', 'Sistema', 'admin@test.com', '$2b$10$LQ7kR4UzZ8kF5pC7P5rJXeBUzNtOJ6A8tFtf0bxEKw9.wh8iOGHmC', 'admin', NOW(), NOW()),
(3, 'María', 'García', 'maria@test.com', '$2b$10$LQ7kR4UzZ8kF5pC7P5rJXeBUzNtOJ6A8tFtf0bxEKw9.wh8iOGHmC', 'user', NOW(), NOW());

-- Verificar datos insertados
SELECT 'Productos insertados:' as info;
SELECT id, title, price FROM public.products;

SELECT 'Usuarios insertados:' as info;
SELECT id, name, email, type FROM public.users;
