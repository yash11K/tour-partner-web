import { Maybe, Scalars } from "./schema.types";

export type Organization = {
  id: string;
  name: string;
  display_name: string;
  branding?: {
    logo_url?: string;
  };
  metadata?: {
    brand?: string;
    createdAt?: string;
    isBlocked?: string;
    [key: string]: string | undefined;
  };
};

export type Company = {
  id: string;
  avatarUrl?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  name: Scalars["String"]["output"];
  brands?: Maybe<Array<Scalars["String"]["output"]>>;
  isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
  metadata?: Maybe<CompanyMetadata>;
};

export type CompanyMetadata = {
  brands?: Maybe<Array<Scalars["String"]["output"]>>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  isBlocked?: Maybe<Scalars["String"]["output"]>;
};
