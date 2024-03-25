import connection from "@/app/api/supabase/SupabaseContextProvider";
import { log } from "console";

const supabase = connection;

export const getRequestDataFromOwner = async (id: any) => {
    const {data, error} = await supabase
        .from('Request')
        .select('*, condo:CondoUnit(name)')
        .eq('user_id', id)
        .order('id', {ascending: true})
    return {data, error}
}

export const submitRequest = async (request: any) => {
    await supabase
        .from('Request')
        .upsert([request])
        .then(res => {
            console.log(res)
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

export const getEmployeesFromCompany = async (id: any) => {
    const {data, error} = await supabase
        .from('Employee')
        .select('*')
        .eq('company_id', id)
    return {data, error}
}

export const assignRequest = async (request_id: any, employee_id: any) => {
    // Employee(request_id, id)
    // Request(id, status, assigned_to)
    await supabase
        .from('Employee')
        .upsert([{id: employee_id, request_id}])
        .then(res => {
            supabase
                .from('Request')
                .upsert([{id: request_id, assigned_to: employee_id}])
                .then(res => {
                    console.log(res)
                })
        })
}