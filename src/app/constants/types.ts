
export enum UserType {
    RENTER = "RENTER",
    OWNER = "OWNER",
    COMPANY = "COMPANY",
    DISCONNECTED = "DISCONNECTED"
}
export interface UserProfileType {
    id?: string;
    first_name?: string;
    last_name?: string;
    contact_email?: string;
    phone_number?: number;
    profile_picture?: string;
    role?: string;
}

export interface PropertyType {
    id: number;
    name: string;
    address: string;
    description: string;
    unit_count: number;
    units?: CondoUnitType[];
    parking_count: number;
    locker_count: number;
    company_id: string;
}

export interface CompanyType {
    id?: string;
    name?: string;
    phone_number?: number;
    email?: string;
}

export interface ParkingSpotType {
    id: number;
    fee: number;
    unit_id: number;
}

export interface LockerType {
    id: number;
    fee: number;
    unit_id: number;
}

export interface CondoUnitType {
    id: number;
    name: string;
    number: number;
    description?: string;
    fee: number;
    size: number;
    registration_key?: string;
    occupied_by?: string; // Foreign key to UserProfile
    files?: CondoFileType[];
    occupant?: UserProfileType;
    property_id: string; // Foreign key to Property
    property_name?: string;
    property: PropertyType;
    parking_spots: ParkingSpotType[];
    lockers: LockerType[];
}

export interface CondoFileType {
    id: number;
    name: string;
    type: string;
    src: string;
    unit: {id: number, name: string};
}

// Other types
export interface HeaderType {
    name: string;
    key: string;
}