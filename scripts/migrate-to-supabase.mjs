/**
 * Migration Script: JSON to Supabase
 *
 * This script migrates all existing data from cms.json to Supabase.
 * Run this ONCE after setting up Supabase.
 *
 * Usage: node --experimental-modules scripts/migrate-to-supabase.mjs
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables!');
  console.error('Please create .env.local file with:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read existing data
const data = JSON.parse(readFileSync('./data/cms.json', 'utf-8'));

console.log('🚀 Starting migration from JSON to Supabase...\n');

async function migrateData() {
  try {
    // 1. Migrate Users
    console.log('📝 Migrating users...');
    if (data.users && data.users.length > 0) {
      const { error: usersError } = await supabase
        .from('users')
        .insert(data.users);

      if (usersError) {
        console.error('❌ Error migrating users:', usersError);
      } else {
        console.log(`✅ Migrated ${data.users.length} users`);
      }
    }

    // 2. Migrate Patients
    console.log('📝 Migrating patients...');
    if (data.patients && data.patients.length > 0) {
      const patientsData = data.patients.map(patient => ({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        password: patient.password,
        phone: patient.phone || '',
        address: patient.address || '',
        date_of_birth: patient.dateOfBirth || '',
        gender: patient.gender || '',
        medical_history: patient.medicalHistory || '',
        created_at: patient.createdAt
      }));

      const { error: patientsError } = await supabase
        .from('patients')
        .insert(patientsData);

      if (patientsError) {
        console.error('❌ Error migrating patients:', patientsError);
      } else {
        console.log(`✅ Migrated ${patientsData.length} patients`);
      }
    }

    // 3. Migrate Doctors (Projects)
    console.log('📝 Migrating doctors...');
    if (data.projects && data.projects.length > 0) {
      const doctorsData = data.projects.map(project => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        excerpt: project.excerpt || '',
        description: project.description || '',
        sector: project.sector || '',
        location: project.location || '',
        status: project.status || 'Available',
        cover_image: project.coverImage || '',
        gallery: project.gallery || [],
        details: project.details || [],
        created_at: project.createdAt
      }));

      const { error: doctorsError } = await supabase
        .from('doctors')
        .insert(doctorsData);

      if (doctorsError) {
        console.error('❌ Error migrating doctors:', doctorsError);
      } else {
        console.log(`✅ Migrated ${doctorsData.length} doctors`);
      }
    }

    // 4. Migrate Appointments (Interests)
    console.log('📝 Migrating appointments...');
    if (data.interests && data.interests.length > 0) {
      const appointmentsData = data.interests.map(interest => ({
        id: interest.id,
        patient_id: null, // Will need to be linked later if needed
        doctor_id: interest.projectId,
        doctor_name: interest.projectTitle,
        name: interest.name,
        email: interest.email,
        phone: interest.phone || '',
        location: interest.company || '',
        service: interest.budget || '',
        appointment_date: interest.date || '',
        appointment_time: interest.time || '',
        message: interest.message || '',
        status: 'pending',
        notes: '',
        created_at: interest.createdAt
      }));

      const { error: appointmentsError } = await supabase
        .from('appointments')
        .insert(appointmentsData);

      if (appointmentsError) {
        console.error('❌ Error migrating appointments:', appointmentsError);
      } else {
        console.log(`✅ Migrated ${appointmentsData.length} appointments`);
      }
    }

    // 5. Migrate Services
    console.log('📝 Migrating services...');
    if (data.services && data.services.length > 0) {
      const servicesData = data.services.map(service => ({
        id: service.id,
        title: service.title,
        summary: service.summary || '',
        features: service.features || []
      }));

      const { error: servicesError } = await supabase
        .from('services')
        .insert(servicesData);

      if (servicesError) {
        console.error('❌ Error migrating services:', servicesError);
      } else {
        console.log(`✅ Migrated ${servicesData.length} services`);
      }
    }

    // 6. Migrate Blogs
    console.log('📝 Migrating blogs...');
    if (data.blogs && data.blogs.length > 0) {
      const blogsData = data.blogs.map(blog => ({
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        author: blog.author || '',
        published_at: blog.publishedAt,
        tags: blog.tags || []
      }));

      const { error: blogsError } = await supabase
        .from('blogs')
        .insert(blogsData);

      if (blogsError) {
        console.error('❌ Error migrating blogs:', blogsError);
      } else {
        console.log(`✅ Migrated ${blogsData.length} blogs`);
      }
    }

    // 7. Migrate News
    console.log('📝 Migrating news...');
    if (data.news && data.news.length > 0) {
      const newsData = data.news.map(newsItem => ({
        id: newsItem.id,
        slug: newsItem.slug,
        title: newsItem.title,
        excerpt: newsItem.excerpt || '',
        content: newsItem.content || '',
        published_at: newsItem.publishedAt,
        source: newsItem.source || ''
      }));

      const { error: newsError } = await supabase
        .from('news')
        .insert(newsData);

      if (newsError) {
        console.error('❌ Error migrating news:', newsError);
      } else {
        console.log(`✅ Migrated ${newsData.length} news items`);
      }
    }

    // 8. Migrate Contacts
    console.log('📝 Migrating contacts...');
    if (data.contacts && data.contacts.length > 0) {
      const contactsData = data.contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        message: contact.message || '',
        created_at: contact.createdAt
      }));

      const { error: contactsError } = await supabase
        .from('contacts')
        .insert(contactsData);

      if (contactsError) {
        console.error('❌ Error migrating contacts:', contactsError);
      } else {
        console.log(`✅ Migrated ${contactsData.length} contacts`);
      }
    }

    // 9. Migrate Site Settings
    console.log('📝 Migrating site settings...');

    // Home settings
    if (data.home) {
      const { error: homeError } = await supabase
        .from('site_settings')
        .upsert({ key: 'home', value: data.home });

      if (homeError) {
        console.error('❌ Error migrating home settings:', homeError);
      } else {
        console.log('✅ Migrated home settings');
      }
    }

    // About settings
    if (data.about) {
      const { error: aboutError } = await supabase
        .from('site_settings')
        .upsert({ key: 'about', value: data.about });

      if (aboutError) {
        console.error('❌ Error migrating about settings:', aboutError);
      } else {
        console.log('✅ Migrated about settings');
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Users: ${data.users?.length || 0}`);
    console.log(`   - Patients: ${data.patients?.length || 0}`);
    console.log(`   - Doctors: ${data.projects?.length || 0}`);
    console.log(`   - Appointments: ${data.interests?.length || 0}`);
    console.log(`   - Services: ${data.services?.length || 0}`);
    console.log(`   - Blogs: ${data.blogs?.length || 0}`);
    console.log(`   - News: ${data.news?.length || 0}`);
    console.log(`   - Contacts: ${data.contacts?.length || 0}`);
    console.log(`   - Site Settings: 2`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
