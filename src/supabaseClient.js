import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fukwqedhzhwbxkojlxnk.supabase.co';

// TODO: REMINDER! Silakan ganti string di bawah ini dengan Kunci Anon (Anon Public Key) asli Anda yang diawali dengan 'eyJhbGciOi...'
const supabaseAnonKey = 'MASUKKAN_ANON_PUBLIC_KEY_SUPABASE_LU_DI_SINI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
