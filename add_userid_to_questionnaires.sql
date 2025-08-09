-- Añadir columna userId a la tabla questionnaires existente
ALTER TABLE questionnaires 
ADD COLUMN "userId" INTEGER;

-- Añadir índice para mejorar performance en consultas por usuario
CREATE INDEX idx_questionnaires_user_id ON questionnaires("userId");

-- Comentario sobre la nueva columna
COMMENT ON COLUMN questionnaires."userId" IS 'ID del usuario que completó el cuestionario';

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'questionnaires';
