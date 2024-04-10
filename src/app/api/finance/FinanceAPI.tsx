import connection from "@/app/api/supabase/SupabaseContextProvider";
import {CondoUnitType, RequestType} from "@/app/constants/types";

const supabase = connection;

export enum PaymentStatus {
    PAID = 'Paid',
    INCOMPLETE = 'Incomplete',
    OVERDUE = 'Overdue',
    UNPAID = 'Unpaid',
    UNOCCUPIED = 'Unoccupied',
    UNAVAILABLE = 'Unavailable'
}

export const getCondoPaymentData = (unit: CondoUnitType) => {
    let condo_fee = unit.size * unit.fee;
    let parking_fee = unit.parking_spots?.reduce((acc, parking_spot) => acc + parking_spot.fee, 0) || 0;
    let locker_fee = unit.lockers?.reduce((acc, locker) => acc + locker.fee, 0) || 0;
    let total_fee = condo_fee + parking_fee + locker_fee;
    total_fee = Math.round(total_fee * 100) / 100;

    let status = PaymentStatus.UNOCCUPIED;

    const occupiedSince = new Date(unit.occupied_since);
    const monthsOccupied = Math.floor((new Date().getTime() - occupiedSince.getTime()) / (1000 * 3600 * 24 * 30)) + 1;
    const totalAmountDue = total_fee * monthsOccupied;

    // Calculate the amount paid
    let amountPaid = unit.payments?.reduce((acc, payment) => {
        if(payment.type === 'CONDO' && payment.paid_by === unit.occupied_by && payment.created_at >= occupiedSince.toISOString()) return acc + payment.amount;
        return acc;
    }, 0) || 0;
    amountPaid = Math.round(amountPaid * 100) / 100;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let amountPaidThisMonth = unit.payments?.reduce((acc, payment) => {
        const paymentDate = new Date(payment.created_at);
        if(payment.type === 'CONDO' && payment.paid_by === unit.occupied_by && paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) return acc + payment.amount;
        return acc;
    }, 0) || 0;
    amountPaidThisMonth = Math.round(amountPaidThisMonth * 100) / 100;
    let amount_due = totalAmountDue - amountPaid;
    amount_due = Math.round(amount_due * 100) / 100;

    if(amountPaid === totalAmountDue) status = PaymentStatus.PAID;
    else if(amountPaidThisMonth === 0) status = PaymentStatus.UNPAID;
    else if(amountPaid < totalAmountDue) status = PaymentStatus.INCOMPLETE;
    else if(amountPaid > totalAmountDue) status = PaymentStatus.OVERDUE;

    console.log(amount_due, amountPaid, status)

    return {data:{
        condo_fee,
        parking_fee,
        locker_fee,
        total_fee,
        amount_due,
        amount_paid: amountPaid,
        status
    }};
}

export const getRequestPaymentData = (request: RequestType) => {
    let status = PaymentStatus.UNAVAILABLE;
    let total_amount_due = request.amount;

    // Calculate the amount paid, simply sum all payments in the request object
    let amount_paid = request.payments?.reduce((acc: number, payment: any) => acc + payment.amount, 0) || 0;
    // Convert float to 2 decimal places
    amount_paid = Math.round(amount_paid * 100) / 100;
    let amount_due = total_amount_due - amount_paid;
    amount_due = Math.round(amount_due * 100) / 100;

    if(amount_due == 0) status = PaymentStatus.PAID;
    else if(amount_due > 0 && amount_due < total_amount_due) status = PaymentStatus.INCOMPLETE;
    else if(amount_due == total_amount_due) status = PaymentStatus.UNPAID;
    else if(amount_due < 0) status = PaymentStatus.OVERDUE;

    return {data:{
        amount_due,
        amount_paid: amount_paid,
        status
    }};
}

export const getPaymentsByUserID = async (id: any)  => {
    const {data , error} = await supabase
        .from('Payment')
        .select('*, unit:CondoUnit(id, name), request:Request(id, description)')
        .eq('paid_by', id)
    return {data, error}
}

export const getCardInfoByUserID = async (id: any) => {
    const {data, error} = await supabase
        .from('UserProfile')
        .select('card_info:CardInfo(*)')
        .eq('id', id)
    return {data, error}
}

export const updateCardInfo = async (id: any, cardInfo: any) => {
    console.log(cardInfo)
    if(cardInfo.id){
        const {data, error} = await supabase
            .from('CardInfo')
            .update(cardInfo)
            .eq('id', cardInfo.id)
            .then(res => {
                console.log(res)
                window.location.reload()
                return {data: res.data, error: res.error}
            })
    } else {
        await supabase
            .from('CardInfo')
            .insert(cardInfo)
            .select().then(res => {
                if(res.error){
                    console.log(res.error)
                    return {data: null, error: res.error}
                }
                if(res.data) {
                    supabase
                        .from('UserProfile')
                        .update({card_info: res.data[0].id})
                        .eq('id', id)
                        .then(res => {
                            console.log(res)
                            window.location.reload()
                            return {data: res.data, error: res.error}
                        })
                }
        })
    }
}

export const forgetCardInfoFromUserID = async (userId: any) => {
    // Get card info id
    const {data: cardInfoData, error: cardInfoError} = await supabase
        .from('UserProfile')
        .select('card_info')
        .eq('id', userId)
    if(cardInfoError || !cardInfoData[0].card_info){
        console.log(cardInfoData, cardInfoError)
        return {data: null, error: cardInfoError}
    }
    if(cardInfoData[0].card_info) {
        await supabase
            .from('CardInfo')
            .delete()
            .eq('id', cardInfoData[0].card_info)
            .then(res => {
                supabase
                    .from('UserProfile')
                    .update({card_info: null})
                    .eq('id', userId)
                    .then(res => {
                        console.log(res)
                        window.location.reload()
                        return {data: res.data, error: res.error}
                    })
            })
    }
}

export const updateCondoFee = async (id: any, fee: any) => {
    await supabase
        .from('CondoUnit')
        .update({fee})
        .eq('id', id)
        .then(res => {
            window.location.reload()
        })
}

export const submitNewPayment = async (payment: any) => {
    await supabase
        .from('Payment')
        .insert([payment])
}

export const getRequestByID = async (id: any) => {
    const {data, error} = await supabase
        .from('Request')
        .select('*, condo:CondoUnit(id, name), payments:Payment(*)')
        .eq('id', id)
    return {data, error}
}
