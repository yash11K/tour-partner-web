import { Maybe, Scalars } from "./schema.types";

export type Organization = {
  id: string;
  name: string;
  display_name: string;
  branding?: {
    logo_url?: string;
  };
  metadata?: {
    avis?:string,
    budget?:string,
    createdAt?: string;
    isBlocked?: string;
    [key: string]: string | undefined;
  };
};

export type Company = {
  id: string;
  cid: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  displayName?: Maybe<Scalars["String"]["output"]>;
  metadata?: Maybe<CompanyMetadata>;
  totalRevenue?: Maybe<Scalars["Int"]["output"]>;
  branding?: Maybe<{
    logo_url?: string;
  }>;
};

export type CompanyMetadata = {
  avis?: boolean;
  budget?:boolean
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  isBlocked?: Maybe<Scalars["String"]["output"]>;
};

// Update the existing Company type or create a new one
export interface CompanyFormFields extends Company {
  avis?: boolean;
  budget?: boolean
  name: string;
  displayName?: string;
  logo?: string;
}
