import {Company, Organization} from "@/rest-api/types";

export const getOrganizations = async (): Promise<{ organizations: { totalCount: number, nodes: Organization[]} }> => {
    const response = await fetch('/organizations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    console.log("API response data:", data);

    return {
        organizations: {
            totalCount: data.length,
            nodes: data.map((org: Organization) => ({
                id: org.id,
                name: org.display_name,
                avatarUrl: org.branding?.logo_url,
                createdAt: org.metadata?.createdAt,
                avis: org.metadata?.avis === "true",
                budget: org.metadata?.budget ==="true"
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
        },
    });

    const data: Organization = await response.json();

    return { company: data };
};

export const COMPANY_CREATE_MUTATION = createOrganization;