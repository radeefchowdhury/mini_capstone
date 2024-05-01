import connection from "@/app/api/supabase/SupabaseContextProvider";

const supabase = connection;

export async function getEmployeeProfilesFromCompany(company_id: string) {
    const {data, error} = await supabase
        .from('Employee')
        .select('*, profile:UserProfile(*)')
        .eq('company_id', company_id);
    return {data, error}
}

export async function insertEmployee(employeeData: any) {
    const {data, error} = await supabase
        .from('Employee')
        .insert(employeeData);
    return {data, error}
}
