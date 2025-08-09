import axios from 'axios';

const BASE_URL = 'http://localhost:3003';

async function testQuestionnaireEndpoints() {
  console.log('🧪 Probando endpoints del cuestionario...\n');

  try {
    // 1. Test envío de cuestionario
    console.log('1️⃣ Probando envío de cuestionario...');
    const submitResponse = await axios.post(`${BASE_URL}/questionnaire/submit`, {
      responses: {
        loves_me: 'sí',
        knows_i_love_her: 'sí'
      },
      userId: 1
    });
    console.log('✅ Envío exitoso:', submitResponse.data);
    console.log('');

    // 2. Test obtener conteo
    console.log('2️⃣ Probando obtener conteo para userId 1...');
    const countResponse = await axios.get(`${BASE_URL}/questionnaire/user/1/count`);
    console.log('✅ Conteo obtenido:', countResponse.data);
    console.log('');

    // 3. Test obtener todos los cuestionarios del usuario
    console.log('3️⃣ Probando obtener cuestionarios del usuario 1...');
    const userResponse = await axios.get(`${BASE_URL}/questionnaire/user/1`);
    console.log('✅ Cuestionarios del usuario:', {
      success: userResponse.data.success,
      count: userResponse.data.data.length,
      firstEntry: userResponse.data.data[0]
    });

  } catch (error) {
    console.error('❌ Error en las pruebas:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testQuestionnaireEndpoints();
