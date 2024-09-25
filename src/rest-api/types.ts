import { Maybe, Scalars } from "./schema.types";

export type Organization = {
  id: string;
  name: string;
  display_name?: string;
  branding?: {
    logo_url?: string;
  };

  //Not using {@CompanyMetadata because dynamic keyvalue pair feature was giving errors}
  metadata?: {
    avis?:string,
    budget?:string,
    createdAt?: string;
    isBlocked?: string;
    [key: string]: string | undefined;
  };
};

export type CompanyMetadata = {
  avis?: boolean;
  budget?:boolean
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  isBlocked?: Maybe<Scalars["String"]["output"]>;
};

export type OrganizationMember = {
  picture: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  // Add other user properties as needed
};

// Update the existing Company type or create a new one