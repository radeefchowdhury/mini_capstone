import connection from "@/app/api/supabase/supabase";

const supabase = connection;

export const getCondoList = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoUnit')
        .select('*, parking_spots:ParkingSpot(*), lockers:Locker(*), property:Property(address)')
        .eq('occupied_by', id)
    return {data, error}
}

