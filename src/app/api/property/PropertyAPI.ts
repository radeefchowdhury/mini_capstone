import connection from "@/app/api/supabase/SupabaseContextProvider";

const supabase = connection;


export const getPropertiesFromCompany = async (id: any) => {
    const {data, error} = await supabase
        .from('Property')
        .select('*, units:CondoUnit(*, files:CondoFile(*)), parking_spots:ParkingSpot(*), lockers:Locker(*)')
        .eq('company_id', id)
        .order('name', {ascending: true})
    return {data, error}
}

export const getCondosFromProperty = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('*')
        .eq('property_id', id)
        .order('name', {ascending: true})
    return {data, error}

}
export const submitPropertyProfile = async (propertyProfile: any) => {
    supabase
        .from('Property')
        .insert([propertyProfile])
        .then(res => {
            window.location.reload()
        })
}

export const getCondosFromOccupant = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('*, parking_spots:ParkingSpot(*), lockers:Locker(*), property:Property(name, address), payments:Payment(*)')
        .eq('occupied_by', id)
        .order('name', {ascending: true})
        .order('property_id', {ascending: true})
    return {data, error}
}

export const getCondosFromCompany = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('*, parking_spots:ParkingSpot(*), lockers:Locker(*), property:Property(name, address), occupant:UserProfile(first_name, last_name), files:CondoFile(*), payments:Payment(*)')
        .eq('property.company_id', id)
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
        .then(res => {
            window.location.reload()
        })

}

export const updateRegistrationKey = async (id: any, key: any) => {
    supabase
        .from('CondoUnit')
        .update({registration_key: key})
        .eq('id', id)
        .then(res => {
            window.location.reload()
        })

}

export const registerCondoUnitWithKey = async (user_id: any, key: any) => {
    supabase
        .from('CondoUnit')
        .update({
            occupied_by: user_id,
            occupied_since: new Date().toISOString(),
        })
        .eq('registration_key', key)
        .then(res => {
            window.location.reload()
        })
}

export const getCondoIDFromName = async (name: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('id')
        .eq('name', name)
    return {data, error}
}

export const getCondoUnitByID = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('*, payments:Payment(*), parking_spots:ParkingSpot(*), lockers:Locker(*)')
        .eq('id', id)
    return {data, error}
}



