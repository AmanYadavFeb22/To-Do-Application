import { supabase } from './supabaseClient';

// Function to sign up a new user
export const signUp = async (credentials) => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.fullName,
        phone_number: credentials.phoneNumber,
        country: credentials.country,
      }
    }
  });

  if (error) throw error;
  return data;
};

// Function to sign in a user
export const signIn = async (credentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) throw error;
  return data;
};

// Function to sign out a user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Function to check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};