export interface UserProfileType {
    id?: string;
    first_name?: string;
    last_name?: string;
    contact_email?: string;
    phone_number?: number;
    profile_picture?: string;
    role?: string;
}

export interface CompanyType {
    id?: string;
    name?: string;
    phone_number?: number;
    email?: string;
}