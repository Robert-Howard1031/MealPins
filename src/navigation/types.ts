import type { Post } from '../lib/types';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  PostDetail: { post: Post };
  UserProfile: { userId: string };
  EditPost: { post: Post };
  EditProfile: undefined;
  Settings: undefined;
};
