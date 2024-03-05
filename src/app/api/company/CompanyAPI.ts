import connection from "@/app/api/supabase/supabase";
import {CompanyType} from "@/app/constants/types";

const supabase = connection;
export const submitCompanyProfile = async (companyProfile: CompanyType) => {
    console.log(companyProfile)
    supabase
        .from('Company')
        .upsert([companyProfile])
        .then(console.log)
    window.location.reload()
}

export const getCompanyProfile = async ()  => {
    const {data, error} = await supabase
        .from('Company')
        .select('*')
    return {data, error}
}