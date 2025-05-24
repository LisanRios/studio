const { createClient } = require('@supabase/supabase-js');

console.log('=== Prueba de Conexión a Supabase ===');

// 1. Configuración
const SUPABASE_URL = 'https://bojqbqbwkqqqmeznhbco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvanFicWJ3a3FxcW1lem5oYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjQyNzgsImV4cCI6MjA2MzEwMDI3OH0.VLtcgQR6DG_imOUm5l-9JEqJGkxP13wNW6o0D6eoLy0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Prueba de conexión mejorada
async function testConnection() {
  try {
    console.log('\n🔍 Verificando conexión...');
    
    // Prueba simple con SELECT 1 (universal en PostgreSQL)
    const { data, error } = await supabase
      .rpc('select_1');
    
    if (error) throw error;
    
    console.log('✅ Conexión exitosa! Respuesta del servidor:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión:', {
      message: error.message,
      code: error.code || 'NO_CODE',
      details: 'Verifica que:\n1. Tus credenciales sean correctas\n2. El proyecto esté activo en Supabase\n3. No haya restricciones de red'
    });
    return false;
  }
}

// 3. Ejecutar prueba
(async () => {
  const connected = await testConnection();
  
  if (connected) {
    console.log('\n🎉 ¡Puedes continuar con la creación de usuarios!');
    console.log('💡 Sugerencia: Ahora crea la tabla "users" desde el panel de Supabase');
  }
})();
