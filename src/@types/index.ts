import { type Profile, type User } from "@prisma/client";

export type Searcher = {
  wallet: string;
  name: string;
};

// from Airtable
export type Fellow = Partial<{
  name: string;
  email: string;
  bio: string;
  affiliation: string;
  twitter: string;
  picture: string;
  website: string;
}>;
export type Applicant = {
  id: string | undefined;
  name: string | undefined;
  searcherDecision: string | undefined;
};
export type UserStatus = Partial<User> & {
  isSignedIn: boolean;
  profile?: Profile;
  isFellow: boolean;
  isSearcher: boolean;
  isSteward: boolean;
};

export type UserProfile = Omit<
  UserStatus,
  | "isSignedIn"
  | "isFellow"
  | "isSearcher"
  | "isSteward"
  | "createdAt"
  | "updatedAt"
>;
