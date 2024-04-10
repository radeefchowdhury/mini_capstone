import connection from "@/app/api/supabase/SupabaseContextProvider";

const supabase = connection;

export const getRequestsFromOccupant = async (id: any) => {
    const {data, error} = await supabase
        .from('Request')
        .select('*, condo:CondoUnit(id, name, occupied_by), payments:Payment(*)')
        .eq('user_id', id)
        .order('id', {ascending: true})
    return {data, error}
}

export const submitRequest = async (request: any) => {
    await supabase
        .from('Request')
        .upsert([request])
        .then(res => {
            console.log(res)
        })
}

export const getRequestDataFromCondoName = async (name: any) => {
    const {data, error} = await supabase
        .from('Request')
        .select('*, unit:CondoUnit(name), payments:Payment(*)')
        .eq('unit.name', name)
    return {data, error}
}

export const getEmployeesFromCompany = async (id: any) => {
    const {data, error} = await supabase
        .from('Employee')
        .select('*')
        .eq('company_id', id)
    return {data, error}
}

export const assignRequest = async (request_id: any, employee_id: any) => {
    await supabase
        .from('Employee')
        .upsert([{id: employee_id, request_id}])
        .then(res => {
            supabase
                .from('Request')
                .upsert([{id: request_id, assigned_to: employee_id}])
                .then(res => {
                    console.log(res)
                })
        })
}

export const updateRequestStatus = async (request: any, status: string) => {
    await supabase
        .from('Request')
        .update({status})
        .eq('id', request)

}