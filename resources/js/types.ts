type DateTime = string;

export type Nullable<T> = T | null;

export interface Team {
  id: number;
  name: string;
  personal_team: boolean;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface User {
  id: number;
  name: string;
  email: string;
  current_team_id: Nullable<number>;
  profile_photo_path: Nullable<string>;
  profile_photo_url: string;
  two_factor_enabled: boolean;
  email_verified_at: Nullable<DateTime>;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface Auth {
  user: Nullable<
    User & {
      all_teams?: Team[];
      current_team?: Team;
    }
  >;
}

export type InertiaSharedProps<T = {}> = T & {
  jetstream: {
    canCreateTeams: boolean;
    canManageTwoFactorAuthentication: boolean;
    canUpdatePassword: boolean;
    canUpdateProfileInformation: boolean;
    flash: any;
    hasAccountDeletionFeatures: boolean;
    hasApiFeatures: boolean;
    hasTeamFeatures: boolean;
    hasTermsAndPrivacyPolicyFeature: boolean;
    managesProfilePhotos: boolean;
    hasEmailVerification: boolean;
  };
  auth: Auth;
  errorBags: any;
  errors: any;
};

export interface Session {
  id: number;
  ip_address: string;
  is_current_device: boolean;
  agent: {
    is_desktop: boolean;
    platform: string;
    browser: string;
  };
  last_active: DateTime;
}

export interface ApiToken {
  id: number;
  name: string;
  abilities: string[];
  last_used_ago: Nullable<DateTime>;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface JetstreamTeamPermissions {
  canAddTeamMembers: boolean;
  canDeleteTeam: boolean;
  canRemoveTeamMembers: boolean;
  canUpdateTeam: boolean;
}

export interface Role {
  key: string;
  name: string;
  permissions: string[];
  description: string;
}

export interface TeamInvitation {
  id: number;
  team_id: number;
  email: string;
  role: Nullable<string>;
  created_at: DateTime;
  updated_at: DateTime;
}

export interface HomeProduct {
  image: string,
  name: string,
  price: string,
  id: string
}

type HomeImages = string[];

export interface HomeProps {
  products: HomeProduct[],
  images: HomeImages[]
}

export type ProductArrayKeys = 'lengths' | 'sizes' | 'belt_lengths';

export type Variant = {
  id?:number,
  belt_length?: string | null,
  length?: string | null,
  size?: string | null,
  quantity:number,
  modified?: boolean,
}

export type AdminProduct = {
  id?: string,
  name: string,
  description: string,
  quantity: number,
  price: number,
  lengths: string[],
  sizes: string[],
  belt_lengths: string[],
  length: string,
  size: string,
  beltLength: string,
  product_variants: Variant[]
}

export type SingleProductT = {
  id: number,
  name: string,
  description: string,
  quantity: number,
  belt_lengths: string[] | null,
  lengths: string[] | null,
  price: number,
  sizes: string[] | null
}

export type PropsContextType = any;

export interface GroupedVariants {
  [beltLength: string]: Variant[];
  sizes: Variant[];
}

export type SingleProductCart = {
  name: string,
  belt_length?:string,
  length?:string,
  size?:string,
}

export type DBSingleProductCartItem = {
  quantity: number,
  variant_id: number
}

export type DBSingleProductCart = {
  items: DBSingleProductCartItem[],
  itemsCount: number,
};

export type ClientCartItem = {
  cart_items_id:number,
  name:string,
  price:string,
  product_id:number,
  belt_length?:string,
  length?:string,
  size?:string,
  variant_id:number,
  quantity:number,
  previewImageUrl:string
}

export type ClientCart = {
  items: ClientCartItem[],
}

export type ProcessingData = {
  isProcessing: boolean,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
}

export interface SearchProduct {
  previewImgUrl: string,
  name: string,
}

export interface SearchSuggestion {
  href: string,
  name: string
}