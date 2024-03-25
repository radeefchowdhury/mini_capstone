
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
    parking_spots?: ParkingSpotType[];
    lockers?: LockerType[];
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

export interface RequestType {
    id: number;
    description: string;
    unit_id: number;
    condo_name?: string;
    condo?: {name: string};
    type: string;
    date: string;
    amount: number;
    status: RequestStatus;
    assigned_to: string;
    employee?: {id: string, name: string};
}

export enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED", // When a request amount is set, but not yet assigned
    ASSIGNED = "ASSIGNED", // When a request is assigned to an employee, but amount is not set
    IN_PROGRESS = "IN PROGRESS", // When a request is both assigned and amount is set
    DENIED = "DENIED",
    COMPLETED = "COMPLETED"
}

export enum RequestTypeOptions {
    MAINTENANCE = "MAINTENANCE",
    TESTING = "TESTING",
    REPAIR = "REPAIR",
    INSPECTION = "INSPECTION",
    NEW_FACILITY = "NEW FACILITY",
}

export interface EmployeeType {
    id: number,
    name: string;
    role: EmployeeRole;
    email: string;
    phone_number: number;
    company_id: string;
}

export enum EmployeeRole {
    ADMIN = "ADMIN",
    TECHNICIAN = "TECHNICIAN",
    MANAGER = "MANAGER",
    INSPECTOR = "INSPECTOR",
    INSTALLER = "INSTALLER",
    TESTER = "TESTER",
    SUPERVISOR = "SUPERVISOR",
    FINANCE = "FINANCE",
}

// Depending on the RequestTypeOption, a request can only be assigned to an employee with a corresponding role
export const RequestTypeToRole = {
    [RequestTypeOptions.MAINTENANCE]: EmployeeRole.TECHNICIAN,
    [RequestTypeOptions.TESTING]: EmployeeRole.TESTER,
    [RequestTypeOptions.REPAIR]: EmployeeRole.TECHNICIAN,
    [RequestTypeOptions.INSPECTION]: EmployeeRole.INSPECTOR,
    [RequestTypeOptions.NEW_FACILITY]: EmployeeRole.INSTALLER,
}

export interface OperationRequestType {
    id: number;
    condo_name: string;
    date_submitted: string;
    unit_id: number;
    request_type: string;
    amount: number;
    status: string;
    assigned_employee: string;
}