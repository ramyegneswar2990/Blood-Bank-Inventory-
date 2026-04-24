export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export type Role = "donor" | "receiver" | "admin";

export interface InventoryItem {
  group: BloodGroup;
  units: number;
  updated: string;
}

export interface BloodRequest {
  id: string;
  patient: string;
  group: BloodGroup;
  units: number;
  hospital: string;
  city: string;
  urgency: "Critical" | "High" | "Normal";
  status: "Pending" | "Accepted" | "Fulfilled" | "Rejected";
  createdAt: string;
}

export interface Donor {
  id: string;
  name: string;
  group: BloodGroup;
  city: string;
  available: boolean;
  lastDonation: string;
  distanceKm: number;
}

export const initialInventory: InventoryItem[] = BLOOD_GROUPS.map((g, i) => ({
  group: g,
  units: [42, 18, 35, 9, 14, 6, 58, 22][i],
  updated: "2025-04-22",
}));

export const initialRequests: BloodRequest[] = [
  { id: "REQ-1042", patient: "Aarav Sharma", group: "O-", units: 2, hospital: "City General", city: "Mumbai", urgency: "Critical", status: "Pending", createdAt: "2025-04-24 09:12" },
  { id: "REQ-1041", patient: "Sara Khan", group: "B+", units: 1, hospital: "St. Mary Hospital", city: "Pune", urgency: "High", status: "Accepted", createdAt: "2025-04-24 08:30" },
  { id: "REQ-1040", patient: "Jose Mathew", group: "A+", units: 3, hospital: "Apollo", city: "Delhi", urgency: "Normal", status: "Fulfilled", createdAt: "2025-04-23 18:05" },
];

export const nearbyDonors: Donor[] = [
  { id: "D-01", name: "Rahul Verma", group: "O-", city: "Mumbai", available: true, lastDonation: "2025-01-10", distanceKm: 1.2 },
  { id: "D-02", name: "Priya Singh", group: "O-", city: "Mumbai", available: true, lastDonation: "2024-12-22", distanceKm: 2.8 },
  { id: "D-03", name: "Amit Patel", group: "B+", city: "Pune", available: false, lastDonation: "2025-03-01", distanceKm: 4.1 },
  { id: "D-04", name: "Neha Gupta", group: "A+", city: "Delhi", available: true, lastDonation: "2024-11-18", distanceKm: 3.5 },
];
