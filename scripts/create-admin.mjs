/**
 * Create Admin Account
 *
 * This script creates a new admin user in Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createId = (prefix) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

async function createAdmin() {
  try {
    console.log('🔐 Creating admin account...\n');

    const newAdmin = {
      id: createId('usr'),
      name: 'Abed Alhamid Shehadi',
      username: 'abedalhamid',
      email: 'abedalhamidshehadi20@gmail.com',
      password: 'abed.208',
      role: 'super-admin',
      permissions: ['all'],
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .insert(newAdmin)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating admin:', error);
      process.exit(1);
    }

    console.log('✅ Admin account created successfully!\n');
    console.log('📋 Account Details:');
    console.log(`   - Name: ${newAdmin.name}`);
    console.log(`   - Email: ${newAdmin.email}`);
    console.log(`   - Username: ${newAdmin.username}`);
    console.log(`   - Role: ${newAdmin.role}`);
    console.log(`   - Permissions: ${newAdmin.permissions.join(', ')}`);
    console.log('\n🔓 Login Credentials:');
    console.log(`   - Email: ${newAdmin.email}`);
    console.log(`   - Password: ${newAdmin.password}`);
    console.log('\n✅ You can now login to the dashboard!');

  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
}

createAdmin();
