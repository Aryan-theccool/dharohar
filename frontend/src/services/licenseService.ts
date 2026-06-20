import { mockLicenseRequests } from '../data/mockData';

export type LicenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFICATION_REQUIRED';

export interface License {
    id: string;
    assetId: { id: string; title: string; type: string; communityName: string } | string;
    applicantId: { id: string; name: string; email: string } | string;
    licenseType: 'RESEARCH' | 'COMMERCIAL' | 'MEDIA' | 'BIO_KNOWLEDGE';
    purpose: string;
    documentation?: string;
    fee?: number;
    status: LicenseStatus;
    adminComment?: string | null;
    agreementText?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApplyLicensePayload {
    assetId: string;
    licenseType: 'RESEARCH' | 'COMMERCIAL' | 'MEDIA' | 'BIO_KNOWLEDGE';
    purpose: string;
    documentation?: string;
    documentationFileId?: string;
    fee?: number;
    // Common applicant identity fields
    fullName?: string;
    email?: string;
    phone?: string;
    organizationName?: string;
    gstNumber?: string;
    intendedUse?: string;
    // Bio-knowledge specific
    bioKnowledgeDetails?: string;
    // Allow additional license-type specific fields
    [key: string]: unknown;
}

export interface ResubmitPayload {
    purpose?: string;
    documentation?: string;
    fee?: number;
}

// General: apply for a license on an approved asset
export const applyForLicense = async (data: ApplyLicensePayload): Promise<License> => {
    return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as any;
};

// General: view own license applications
export const getMyLicenses = async (): Promise<License[]> => {
    return mockLicenseRequests.map(lr => ({
        id: lr.id,
        assetId: { title: lr.assetTitle, communityName: lr.communityName, id: 'mock', type: 'BIO' },
        applicantId: { name: lr.applicant, email: 'mock@example.com', id: 'mock' },
        purpose: lr.justification,
        licenseType: lr.intendedUse as any,
        status: lr.status as any,
        createdAt: lr.requestDate,
        updatedAt: lr.requestDate
    })) as any;
};

// General: resubmit after MODIFICATION_REQUIRED
export const resubmitLicense = async (id: string, _data: ResubmitPayload): Promise<License> => {
    return { id, status: 'PENDING' } as any;
};

// Community: see which licenses have been granted for their assets
export const getLicensesForAsset = async (_assetId: string): Promise<License[]> => {
    return [];
};

// Admin: view all pending applications
export const getPendingLicenses = async (): Promise<License[]> => {
    return mockLicenseRequests.map(lr => ({
        id: lr.id,
        assetId: { title: lr.assetTitle, communityName: lr.communityName, id: 'mock', type: 'BIO' },
        applicantId: { name: lr.applicant, email: 'mock@example.com', id: 'mock' },
        purpose: lr.justification,
        licenseType: lr.intendedUse as any,
        status: lr.status as any,
        createdAt: lr.requestDate,
        updatedAt: lr.requestDate
    })) as any;
};

// Admin: view all license applications
export const getAllLicenses = async (): Promise<License[]> => {
    return [];
};

// Admin: approve
export const approveLicense = async (id: string): Promise<License> => {
    return { id, status: 'APPROVED' } as any;
};

// Admin: reject (comment required)
export const rejectLicense = async (id: string, adminComment: string): Promise<License> => {
    return { id, status: 'REJECTED', adminComment } as any;
};

// Admin: request modification (comment required)
export const requestModification = async (id: string, adminComment: string): Promise<License> => {
    return { id, status: 'MODIFICATION_REQUIRED', adminComment } as any;
};
