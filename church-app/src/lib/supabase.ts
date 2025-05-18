import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://ojzukzcdbcujdamreqro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qenVremNkYmN1amRhbXJlcXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODU2MDUsImV4cCI6MjA2MzA2MTYwNX0.bD5DHX7C3iAQgc9x82blL0FDzqaPzE8uD9IRgRvKFjI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 