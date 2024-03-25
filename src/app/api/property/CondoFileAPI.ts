import connection from "@/app/api/supabase/SupabaseContextProvider";

const supabase = connection;

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

export const submitCondoFile = async (file: any) => {
    if(file.id === undefined) delete file.id
    supabase
        .from('CondoFile')
        .upsert([file])
        .then(console.log)
}
export const getCondoFileURL = async (fileName: string) => {
    const {data} = supabase
        .storage
        .from('condo_file_bucket')
        .getPublicUrl(fileName)
    return data.publicUrl
}

export const deleteCondoFile = async (id: any) => {
    supabase
        .from('CondoFile')
        .delete()
        .eq('id', id)
        .then(console.log)
}

export const getFilesFromProperty = async (id: any) => {
    // Get condo from property id
    const {data: condoData, error: condoError } = await supabase
        .from('CondoUnit')
        .select('id')
        .eq('property_id', id)

    // convert to an array of ids
    const condoIDs = condoData?.map((condo: any) => condo.id) || []

    const {data, error} = await supabase
        .from('CondoFile')
        .select('*, unit:CondoUnit(id, name, property_id)')
        .in('unit_id', condoIDs)
    return {data, error}
}

export const getCondoFilesFromCondoId = async (id: any) => {
    const {data, error} = await supabase
        .from('CondoFile')
        .select('*, unit:CondoUnit(id, name, property_id)')
        .eq('unit_id', id)
    return {data, error}
}