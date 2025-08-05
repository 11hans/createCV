// types/auth.ts
import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata: {
    name: string;
  }
}

export interface AuthState {
  user: AuthUser | null;
  initialized: boolean;
  loading: boolean;
}

export interface SignUpOptions {
  name: string;
  redirectTo?: string;
}

// Add type guard if needed
export function isAuthUser(user: User | null): user is AuthUser {
  return user !== null && 'user_metadata' in user && 'name' in user.user_metadata;
}