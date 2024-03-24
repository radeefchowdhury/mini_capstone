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