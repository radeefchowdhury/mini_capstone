import connection from "@/app/api/supabase/SupabaseContextProvider";
import { log } from "console";

const supabase = connection;

export const getRequestDataFromOwner = async (id: any) => {
    const {data, error} = await supabase
        .from('Request')
        .select('*, unit:CondoUnit(name)')
        .eq('user_id', id)
        .order('date', {ascending: true})
    console.log(data)
    return {data, error}
}

export const submitRequest = async (request: any) => {
    supabase
        .from('Request')
        .upsert([request])
        .then(res => {
            console.log(res)
            window.location.reload()
        })
}

export const getRequestDataFromCondoName = async (name: any) => {
    const {data, error} = await supabase
        .from('Request')
        .select('*, unit:CondoUnit(name)')
        .eq('unit.name', name)
    console.log(data)
    return {data, error}
}


