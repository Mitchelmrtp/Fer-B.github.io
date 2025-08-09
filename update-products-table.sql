-- Script para actualizar la tabla products y remover columnas innecesarias
-- Ejecutar este script en la base de datos PostgreSQL

-- Eliminar columnas si existen (ignorar errores si no existen)
ALTER TABLE products DROP COLUMN IF EXISTS "isActive";
ALTER TABLE products DROP COLUMN IF EXISTS stock;

-- Verificar estructura actual de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;
