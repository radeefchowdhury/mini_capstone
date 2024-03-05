import connection from "@/app/api/supabase/supabase";
import {log} from "node:util";

const supabase = connection;


export const getPropertiesFromCompany = async (id: any) => {
    const {data, error} = await supabase
        .from('Property')
        .select('*')
        .eq('company_id', id)
    return {data, error}
}

export const submitPropertyProfile = async (propertyProfile: any) => {
    supabase
        .from('Property')
        .insert([propertyProfile])
        .then(res => {console.log(res)})
    window.location.reload()
}

export const getCondoListFromPublicUser = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('*, parking_spots:ParkingSpot(*), lockers:Locker(*), property:Property(address)')
        .eq('occupied_by', id)
    return {data, error}
}

export const getCondoListFromCompany = async (id: any) => {

}

