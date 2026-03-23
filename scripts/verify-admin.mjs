/**
 * Verify Admin Account
 * Check if admin account exists in Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAdmin() {
  try {
    console.log('🔍 Checking for admin account...\n');

    // Try to find the admin
    const { data, error } = await supabase
      .from('users')
      .select('id, name, username, email, role, permissions')
      .eq('email', 'abedalhamidshehadi20@gmail.com');

    if (error) {
      console.error('❌ Error:', error.message);
      console.error('\n⚠️  The users table might not exist or RLS policies are blocking access.');
      console.error('💡 Solution: Run the SQL in create-admin.sql directly in Supabase SQL Editor');
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('❌ Admin account NOT found!\n');
      console.log('📝 To create the account:');
      console.log('   1. Open Supabase Dashboard');
      console.log('   2. Go to SQL Editor');
      console.log('   3. Run the SQL in create-admin.sql');
      process.exit(1);
    }

    console.log('✅ Admin account found!\n');
    console.log('📋 Account Details:');
    data.forEach(user => {
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Name: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Username: ${user.username}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Permissions: ${JSON.stringify(user.permissions)}`);
    });

    console.log('\n✅ You can now login with:');
    console.log('   - Email: abedalhamidshehadi20@gmail.com');
    console.log('   - Password: abed.208');

  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

verifyAdmin();
