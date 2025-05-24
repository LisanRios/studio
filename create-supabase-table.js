const { createClient } = require('@supabase/supabase-js');

// Configuración
const SUPABASE_URL = 'https://bojqbqbwkqqqmeznhbco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvanFicWJ3a3FxcW1lem5oYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjQyNzgsImV4cCI6MjA2MzEwMDI3OH0.VLtcgQR6DG_imOUm5l-9JEqJGkxP13wNW6o0D6eoLy0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Datos de ejemplo
const sampleUsers = [
  {
    id: 'user_001',
    email: 'admin@example.com',
    status: 'active',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'user_002',
    email: 'user@example.com',
    status: 'active',
    role: 'user',
    created_at: new Date().toISOString()
  }
];

async function insertUsers() {
  try {
    console.log('📝 Insertando usuarios de ejemplo...');
    
    // Verificar conexión primero
    const { error: connError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (connError) throw connError;
    
    // Insertar usuarios
    const { data, error } = await supabase
      .from('users')
      .insert(sampleUsers);

    if (error) throw error;
    
    console.log('✅ Usuarios insertados correctamente:', data);
    
  } catch (error) {
    console.error('❌ Error:', {
      message: error.message,
      code: error.code,
      details: 'Verifica que:\n1. La tabla users existe\n2. Los campos coinciden con la estructura de la tabla\n3. Tienes permisos de escritura'
    });
  }
}

insertUsers();
