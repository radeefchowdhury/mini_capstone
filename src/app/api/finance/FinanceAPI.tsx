import connection from "@/app/api/supabase/SupabaseContextProvider";
import {CondoUnitType, RequestType, UserType} from "@/app/constants/types";
import {neq} from "semver";
import {getCondosFromCompany, getCondosFromOccupant} from "@/app/api/property/PropertyAPI";

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

    // console.log(amount_due, amountPaid, status)

    return {data:{
        condo_fee,
        parking_fee,
        locker_fee,
        total_fee,
        amount_due : unit.occupied_by ? amount_due : 0,
        amount_paid: unit.occupied_by ? amountPaid : 0,
        status: unit.occupied_by ? status : PaymentStatus.UNOCCUPIED
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

export const getOperationWidgetData = async (company_id: any) => {
    // get all payments of type 'CONDO' for which unit_id is owned by the company
    const {data: paymentData, error: paymentError} = await supabase
        .from('Payment')
        .select('amount, unit:CondoUnit(property:Property(*, company_id))')
        .eq('unit.property.company_id', company_id)
    if (paymentError) {
        console.error(paymentError);
        return {data: null, error: paymentError};
    } 
    const budget = paymentData.reduce((sum, record) => {
        if(!record.unit) return sum;
        return sum + parseFloat(record.amount);
    }, 0);
    // get all requests for which the unit is owned by the company
    const {data: requestData, error: requestError} = await supabase
        .from('Request')
        .select('amount, status, unit:CondoUnit(property:Property(*, company_id))')
        .eq('unit.property.company_id', company_id)
    if (requestError) {
        console.error(requestError);
        return {data: null, error: requestError};
    }
    // Calculate the total amount of all requests that are not completed
    const costs = requestData.reduce((sum: number, record: any) => {
        if (record.status !== 'COMPLETED' && record.amount) return sum + Number(record.amount);
        return sum;
    }, 0);

    // Calculate the total amount of all requests that are completed
    const paid_amount = requestData.reduce((sum: number, record: any) => {
        if (record.status === 'COMPLETED' && record.amount) return sum + Number(record.amount);
        return sum;
    }, 0);

    console.log(budget, costs, paid_amount)

    return {data: {
        budget,
        costs,
        paid_amount
    }, error: null};
}

export const getTotalAmountDue = async (user_id: string, type: UserType) => {
    if(type === UserType.DISCONNECTED) return {data: null, error: 'User type is not defined'};
    const getCondosFunction = {
        [UserType.COMPANY]: getCondosFromCompany,
        [UserType.OWNER]: getCondosFromOccupant,
        [UserType.RENTER]: getCondosFromOccupant,
    };
    const {data: condoData, error: condoError} = await getCondosFunction[type](user_id);
    console.log(condoData, condoError)
    if (condoError) {
        console.error(condoError);
        return {data: null, error: condoError};
    } else {
        if(!condoData) return {data: 0, error: null}
        const totalAmount = condoData.reduce((sum, record) => {
            const condoPaymentData = getCondoPaymentData(record);
            return sum + condoPaymentData.data.amount_due;
        }, 0);
        return {data: totalAmount, error: null};
    }
}

export const getTotalAmountPaid = async (user_id: string, type: UserType) => {
    if(type === UserType.DISCONNECTED) return {data: null, error: 'User type is not defined'};
    const getCondosFunction = {
        [UserType.COMPANY]: getCondosFromCompany,
        [UserType.OWNER]: getCondosFromOccupant,
        [UserType.RENTER]: getCondosFromOccupant,
    };
    const {data: condoData, error: condoError} = await getCondosFunction[type](user_id);
    if (condoError) {
        console.error(condoError);
        return {data: null, error: condoError};
    } else {
        if(!condoData) return {data: 0, error: null}
        const totalAmount = condoData.reduce((sum, record) => {
            const condoPaymentData = getCondoPaymentData(record);
            return sum + condoPaymentData.data.amount_paid;
        }, 0);
        return {data: totalAmount, error: null};
    }
}

export const getFinanceWidgetData = async (user_id: string, type: UserType) => {
    // Get total amount due, total amount paid, number of paid units, number of unpaid units, number of incomplete units
    if(type === UserType.DISCONNECTED) return {data: null, error: 'User type is not defined'};
    const getCondosFunction = {
        [UserType.COMPANY]: getCondosFromCompany,
        [UserType.OWNER]: getCondosFromOccupant,
        [UserType.RENTER]: getCondosFromOccupant,
    };
    const {data: condoData, error: condoError} = await getCondosFunction[type](user_id);
    if (condoError) {
        console.error(condoError);
        return {data: null, error: condoError};
    } else {
        if(!condoData) return {data: null, error: null}
        const totalAmountDue = await getTotalAmountDue(user_id, type);
        const totalAmountPaid = await getTotalAmountPaid(user_id, type);
        const totalUnits = condoData.length;
        const paidUnits = condoData.reduce((sum, record) => {
            const condoPaymentData = getCondoPaymentData(record);
            if(condoPaymentData.data.status === PaymentStatus.PAID) return sum + 1;
            return sum;
        }, 0);
        const unpaidUnits = condoData.reduce((sum, record) => {
            const condoPaymentData = getCondoPaymentData(record);
            if(condoPaymentData.data.status === PaymentStatus.UNPAID) return sum + 1;
            return sum;
        }, 0);
        const incompleteUnits = condoData.reduce((sum, record) => {
            const condoPaymentData = getCondoPaymentData(record);
            if(condoPaymentData.data.status === PaymentStatus.INCOMPLETE) return sum + 1;
            return sum;
        }, 0);
        return {data: {
            totalAmountDue: totalAmountDue.data,
            totalAmountPaid: totalAmountPaid.data,
            totalUnits,
            paidUnits,
            unpaidUnits,
            incompleteUnits
        }, error: null};
    }
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
