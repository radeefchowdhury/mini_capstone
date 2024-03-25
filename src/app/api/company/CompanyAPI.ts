import connection from "@/app/api/supabase/SupabaseContextProvider";
import {CompanyType} from "@/app/constants/types";

const supabase = connection;
export const submitCompanyProfile = async (companyProfile: CompanyType) => {
    supabase
        .from('Company')
        .upsert([companyProfile])
        .then(res => {
            console.log(res)
            window.location.reload()
        })
}

export const getCompanyProfile = async ()  => {
    const {data, error} = await supabase
        .from('Company')
        .select('*')
    return {data, error}
}

export const getRequestsFromCompany = async (id: any) => {
    const {data, error} = await supabase
        .from('Request')
        .select('*, condo:CondoUnit(name, property_id, property:Property(name, address))')
        .eq('condo.property.company_id', id)

    return {data, error}
}