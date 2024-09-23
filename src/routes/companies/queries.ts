import {Company, Organization} from "@/rest-api/types";
import { useAuth0 } from "@auth0/auth0-react";

export const getOrganizations = async (): Promise<{ organizations: { totalCount: number, nodes: Organization[]} }> => {
    console.log("getOrganizations function called");
    const token = localStorage.getItem('auth_token');
    console.log("Token from localStorage:", token); // Log the token

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
    console.log("Request headers:", headers); // Log the headers

    const response = await fetch('http://localhost:8080/organizations', {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch organizations');
    }

    const data = await response.json();
    console.log("API response data:", data);

    return {
        organizations: {
            totalCount: token?.length ?? 0,
            nodes: data.map((org: Organization) => ({
                id: org.id,
                name: org.display_name,
                avatarUrl: org.branding?.logo_url,
                createdAt: org.metadata?.createdAt,
                avis: org.metadata?.avis === "true",
                budget: org.metadata?.budget === "true"
            })),
        },
    };
};

export const createOrganization = async (input: Partial<Organization>): Promise<{ organization: Organization }> => {
    const response = await fetch('http://localhost:8080/organizations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error('Failed to create organization');
    }

    const data: Organization = await response.json();
    return { organization: data };
};

export const getOrganization = async (id: string): Promise<{ company: Organization }> => {
    const response = await fetch(`/organizations/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`, // Assuming a getToken function exists
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch organization with id ${id}`);
    }

    const data: Organization = await response.json();

    return { company: data };
};

export const COMPANY_CREATE_MUTATION = createOrganization;
function getToken() {
    throw new Error("Function not implemented.");
}

