import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';
import { fetchProfile, upsertProfile } from '../lib/api';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      if (data.session?.user?.id) {
        try {
          const fetched = await fetchProfile(data.session.user.id);
          if (fetched) {
            setProfile(fetched);
          } else {
            const metadata = data.session.user.user_metadata as {
              username?: string;
              display_name?: string;
            };
            if (metadata?.username && metadata?.display_name) {
              const created = await upsertProfile({
                id: data.session.user.id,
                username: metadata.username,
                display_name: metadata.display_name,
                bio: '',
                avatar_url: null,
              });
              setProfile(created);
            }
          }
        } catch (error) {
          console.warn('Failed to load profile', error);
        }
      }
      setLoading(false);
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        try {
          const fetched = await fetchProfile(newSession.user.id);
          if (fetched) {
            setProfile(fetched);
          } else {
            const metadata = newSession.user.user_metadata as {
              username?: string;
              display_name?: string;
            };
            if (metadata?.username && metadata?.display_name) {
              const created = await upsertProfile({
                id: newSession.user.id,
                username: metadata.username,
                display_name: metadata.display_name,
                bio: '',
                avatar_url: null,
              });
              setProfile(created);
            } else {
              setProfile(null);
            }
          }
        } catch (error) {
          console.warn('Failed to load profile', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (params: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          username: params.username,
          display_name: params.displayName,
        },
      },
    });

    if (error) throw error;

    if (data.session?.user) {
      const created = await upsertProfile({
        id: data.session.user.id,
        username: params.username,
        display_name: params.displayName,
        bio: '',
        avatar_url: null,
      });
      setProfile(created);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (!session?.user?.id) return;
    const fetched = await fetchProfile(session.user.id);
    setProfile(fetched);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
