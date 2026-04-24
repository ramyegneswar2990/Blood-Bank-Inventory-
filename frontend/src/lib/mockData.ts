// Blood group type constants used across the frontend.
// All request/inventory data now comes from the real backend API.

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

// Roles are defined in AuthContext.tsx to keep auth logic co-located.
