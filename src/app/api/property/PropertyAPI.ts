import connection from "@/app/api/supabase/SupabaseContextProvider";
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
        .select('*, parking_spots:ParkingSpot(*), lockers:Locker(*), property:Property(name, address)')
        .eq('occupied_by', id)
    return {data, error}
}

export const getCondoListFromCompany = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('*, parking_spots:ParkingSpot(*), lockers:Locker(*), property:Property(name, address), Occupant:UserProfile(first_name)')
        .eq('property.company_id', id)
    console.log(data)
    return {data, error}
}

export const getPropertyIdByName = async (name: any) => {
    const {data, error} = await supabase
        .from('Property')
        .select('id')
        .eq('name', name)
    return {data, error}
}

export const submitCondoProfile = async (condoProfile: any) => {
    console.log(condoProfile)
    supabase
        .from('CondoUnit')
        .insert([condoProfile])
        .then(res => {console.log(res)})
    window.location.reload()
}

export const updateRegistrationKey = async (id: any, key: any) => {
    supabase
        .from('CondoUnit')
        .update({registration_key: key})
        .eq('id', id)
        .then(res => {console.log(res)})
    window.location.reload()
}

export const registerCondoUnitWithKey = async (user_id: any, key: any) => {
    supabase
        .from('CondoUnit')
        .update({occupied_by: user_id})
        .eq('registration_key', key)
        .then(res => {console.log(res)})
    window.location.reload()
}

export const getFilesFromProperty = async (id: any) => {
    // CondoFile(id, name, file, unit_id)
    // CondoUnit(id, name, number, description, fee, size, registration_key, occupied_by, property_id)

    const {data, error} = await supabase
        .from('CondoFile')
        .select('*, unit:CondoUnit(id, name)')
        .eq('unit.property_id', id)
    return {data, error}
}

export const getCondoIDFromName = async (name: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('id')
        .eq('name', name)
    return {data, error}
}

export const uploadCondoFile = async (file: any, fileName: string) => {
    await supabase
        .storage
        .from('condo_file_bucket')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
        })
        .catch(console.error)
}

export const createCondoFileInstance = async (file: any) => {
    supabase
        .from('CondoFile')
        .insert([file])
        .then(console.log)
}
export const getCondoFileURL = async (fileName: string) => {
    const {data} = supabase
        .storage
        .from('condo_file_bucket')
        .getPublicUrl(fileName)

    return data.publicUrl
}

