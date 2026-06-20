import { allMarketplaceAssets, mockPendingAssets } from '../data/mockData';

export interface AiMetadata {
    domainClassification?: string;
    riskTierSuggestion?: 'LOW' | 'MEDIUM' | 'HIGH';
    suggestedLicenseType?: 'RESEARCH' | 'COMMERCIAL' | 'MEDIA';
    summary?: string;
    sensitiveContentFlag?: boolean;
    keywords?: string[];
}

export interface Asset {
    id: string;
    type: 'BIO' | 'SONIC';
    title: string;
    description: string;
    communityName: string;
    recordeeName: string;
    riskTier?: string;
    mediaUrl?: string;       // Synthesized on backend: /api/files/{mediaFileId}
    mediaFileId?: string;    // Raw GridFS ObjectId (also present)
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewComment?: string | null;
    createdBy?: { name: string; email: string };
    metadata?: Record<string, any>;
    transcript?: string;
    createdAt: string;
    updatedAt: string;
    aiMetadata?: AiMetadata;
    aiProcessed?: boolean;
}


export interface CreateAssetPayload {
    type: 'BIO' | 'SONIC';
    title: string;
    description: string;
    recordeeName: string;
    communityName: string;
    riskTier?: string;
    transcript?: string;
    metadata?: Record<string, unknown>;
}

// Community: submit a new asset
export const submitAsset = async (data: CreateAssetPayload): Promise<Asset> => {
    // Mock implementation
    return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        approvalStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as Asset;
};

// Community: get own assets (all statuses)
export const getMyAssets = async (): Promise<Asset[]> => {
    // Return mock data
    return allMarketplaceAssets.map(a => ({
        ...a,
        description: a.summary || a.description,
        recordeeName: a.attribution,
        approvalStatus: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })) as Asset[];
};

// Reviewer: get pending assets
export const getPendingAssets = async (): Promise<Asset[]> => {
    return mockPendingAssets.map(a => ({
        ...a,
        recordeeName: 'Mock Submitter',
        approvalStatus: 'PENDING',
        createdAt: a.submittedDate,
        updatedAt: a.submittedDate
    })) as Asset[];
};

export interface PaginatedAssets {
    assets: Asset[];
    total: number;
    page: number;
    hasMore: boolean;
}

// Marketplace / General: get approved-only assets (paginated)
export const getPublicAssets = async (page = 1, limit = 12): Promise<PaginatedAssets> => {
    const assets = allMarketplaceAssets.map(a => ({
        ...a,
        description: a.summary || a.description,
        recordeeName: a.attribution,
        approvalStatus: 'APPROVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })) as Asset[];

    const start = (page - 1) * limit;
    const paginated = assets.slice(start, start + limit);

    return {
        assets: paginated,
        total: assets.length,
        page,
        hasMore: start + limit < assets.length
    };
};

export const getReviewedAssets = async (): Promise<Asset[]> => {
    return [];
};

// Reviewer: approve an asset
export const approveAsset = async (id: string): Promise<Asset> => {
    return { id, approvalStatus: 'APPROVED' } as Asset;
};

// Reviewer: reject an asset (comment required)
export const rejectAsset = async (id: string, reviewComment: string): Promise<Asset> => {
    return { id, approvalStatus: 'REJECTED', reviewComment } as Asset;
};

// Play SONIC asset
export const getSonicPlayUrl = async (_assetId: string): Promise<string> => {
    return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`;
};
