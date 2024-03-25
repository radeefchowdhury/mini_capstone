import connection from "@/app/api/supabase/SupabaseContextProvider";

const supabase = connection;

export const deleteParkingLocker = async (id: any, type: 'PARKING' | 'LOCKER') => {
    const {data, error} = await supabase
        .from(type == 'PARKING' ? 'ParkingSpot' : 'Locker')
        .delete()
        .eq('id', id)
    return {data, error}
}

export const createParkingLocker = async (property_id: number, type: 'PARKING' | 'LOCKER') => {
    const {data, error} = await supabase
        .from(type == 'PARKING' ? 'ParkingSpot' : 'Locker')
        .insert([{property_id}])
    return {data, error}
}

export const getParkingLockerListFromProperty = async (id: any, type: 'PARKING' | 'LOCKER') => {
    const {data, error} = await supabase
        .from(type == 'PARKING' ? 'ParkingSpot' : 'Locker')
        .select('*')
        .eq('property_id', id)
        .order('id', {ascending: true})
    return {data, error}
}

export const freeParkingLockerById = async (item_id: number, type: 'PARKING' | 'LOCKER') => {
    const {data, error} = await supabase
        .from(type == 'PARKING' ? 'ParkingSpot' : 'Locker')
        .update({unit_id: null})
        .eq('id', item_id)
    return {data, error}
}

export const allocateParkingLockerById = async (item_id:number, unit_id: number, type: 'PARKING' | 'LOCKER') => {
    const {data, error} = await supabase
        .from(type == 'PARKING' ? 'ParkingSpot' : 'Locker')
        .update({unit_id: unit_id})
        .eq('id', item_id)
    return {data, error}
}

export const getHighestParkingLockerId = async (type: 'PARKING' | 'LOCKER') => {
    const {data, error} = await supabase
        .from(type == 'PARKING' ? 'ParkingSpot' : 'Locker')
        .select('id')
        .order('id', {ascending: false})
        .limit(1)
    return {data, error}
}

export const updateParkingLockerFee = async (id: number, fee: number, type: 'PARKING' | 'LOCKER') => {
    const {data, error} = await supabase
        .from(type == 'PARKING' ? 'ParkingSpot' : 'Locker')
        .update({fee})
        .eq('id', id)
    return {data, error}
}
