"use client"
import React, {useEffect} from 'react';
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import {CardInfoType, CondoUnitType, PaymentType, RequestType, UserType} from "@/app/constants/types";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import PaymentInfo from "@/app/dashboard/payments/PaymentInfo";
import {
    getPaymentsByUserID,
    getRequestByID,
    getRequestPaymentData,
    PaymentStatus,
    submitNewPayment
} from "@/app/api/finance/FinanceAPI";
import {getCondosFromOccupant} from "@/app/api/property/PropertyAPI";
import {getRequestsFromOccupant, updateRequestStatus} from "@/app/api/request/RequestAPI";
import {useSearchParams} from "next/navigation";

const paymentsTableHeaders = [
    {name: 'ID', key: 'id'},
    {name: 'Date', key: 'date'},
    {name: 'Amount', key: 'amount'},
    {name: 'Type', key: 'type'},
    {name: 'Card Number', key: 'card_number'},
]
function Page() {
    const [userType, setUserType] = React.useState<UserType>();
    const [userId, setUserId] = React.useState<string>();
    const [newPayment, setNewPayment] = React.useState<PaymentType>({} as PaymentType);
    const [payments, setPayments] = React.useState<PaymentType[]>([]);
    const [filteredPayments, setFilteredPayments] = React.useState<any[]>([]);
    const [showForm, setShowForm] = React.useState<boolean>(false);
    const [condoList, setCondoList] = React.useState<CondoUnitType[]>([]);
    const [requestList, setRequestList] = React.useState<RequestType[]>([]);
    const [cardInfo, setCardInfo] = React.useState<CardInfoType>({} as CardInfoType);
    const [error, setError] = React.useState<string>('');

    const searchParams = useSearchParams()
    const param_id = searchParams.get('id') || '';
    const param_type = searchParams.get('type') || '';

    const makeNewPaymentButton = () => {
        setShowForm(true);
        setNewPayment({type: 'CONDO'} as PaymentType);
    }

    const checkPaymentForm = () => {
        // Check if all fields are filled
        if(!newPayment) return false
        if(newPayment.type === 'CONDO' && !newPayment.unit_id){
            setError('Please select a condo');
            return false;
        }
        if(newPayment.type === 'REQUEST' && !newPayment.request_id){
            setError('Please select a request');
            return false;
        }
        if(!newPayment.amount){
            setError('Please enter an amount');
            return false;
        }
        if(!cardInfo.number){
            setError('Please enter a card number');
            return false;
        }
        if(!cardInfo.exp_date){
            setError('Please enter an expiry date');
            return false;
        }
        if(!cardInfo.cvc){
            setError('Please enter a cvc');
            return false;
        }
        setError('');
        return true;
    }

    const submitPayment = async () => {
        if(!checkPaymentForm()) return;
        const paymentToSubmit = {
            ...newPayment,
            paid_by: userId,
            last_four: cardInfo.number.slice(-4),
        }
        await submitNewPayment(paymentToSubmit).catch(console.error)
            .then(() => checkToUpdateRequestStatus(paymentToSubmit as PaymentType))
            .then(() => {window.location.href = '/dashboard/payments'})
    }

    const checkToUpdateRequestStatus = async (payment: PaymentType) => {
        if(!payment.request_id) return;
        const {data: requestData, error: requestError} = await getRequestByID(payment.request_id)
        if(requestError || !requestData){
            console.error(requestError);
            return;
        }
        const {data} = getRequestPaymentData(requestData[0]);
        if(error || !data) return;
        console.log(data)
        if(data.status == PaymentStatus.PAID){
            updateRequestStatus(payment.request_id, 'COMPLETED').then(() => {
                window.location.href = '/dashboard/payments'
            }).catch(console.error)
        }

    }

    const fetchPayments = async () => {
        if(!userType || !userId) return;
        const { data: payments, error: paymentError } = await getPaymentsByUserID(userId);
        const { data: condos, error: condoError } = await getCondosFromOccupant(userId);
        const { data: requests, error: requestError } = await getRequestsFromOccupant(userId);
        if (paymentError || condoError || requestError) {
            console.error(paymentError, condoError, requestError);
        } else {
            setPayments(payments || []);
            setCondoList(condos || []);
            setRequestList(requests || []);
        }
    }

    useEffect(() => {
        if(param_id && param_type){
            setShowForm(true);
            setNewPayment(
            {
                ...newPayment,
                type: param_type as "CONDO" | "REQUEST",
                request_id: param_type === 'REQUEST' ? parseInt(param_id) : undefined,
                unit_id: param_type === 'CONDO' ? parseInt(param_id) : undefined,
            });
        }
    }, [param_id, param_type])

    useEffect(() => {
        let filteredPayments = payments.map((payment) => {
            const date = new Date(payment.created_at);
            const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            const amount = payment.amount.toFixed(2);
            return {
                id: payment.id,
                date: formattedDate,
                amount: "$"+amount,
                card_number: '**** **** **** ' + payment.last_four,
                type: payment.type,
            }
        });
        setFilteredPayments(filteredPayments || []);
    }, [payments]);

    useEffect(() => {
        if(!userType || !userId) return;
        fetchPayments().catch(console.error)
    }, [userType, userId]);

    useEffect(() => {
        setUserType(localStorage.getItem('user_role') as UserType);
        setUserId(localStorage.getItem('user_id') || '');
    }, [userType, userId])

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={"min-w-0 max-w-fit"}>
                <DashboardPanel
                    title={'My Payments'}
                    buttonTitle={'Make New Payment'}
                    onClick={makeNewPaymentButton}
                    children={<DashboardTable items={filteredPayments} headers={paymentsTableHeaders}/>}
                />
            </div>
            <div className={"min-w-[370px]"}>
                {(showForm && userId) && <DashboardPanel
                    title={'Make New Payment'}
                    children={<PaymentInfo
                        payment={newPayment}
                        setPayment={setNewPayment}
                        userId={userId}
                        condos={condoList}
                        requests={requestList}
                        cardInfo={cardInfo}
                        setCardInfo={setCardInfo}
                        error={error}
                    />}
                    buttonTitle={'Make Payment'}
                    onClick={submitPayment}
                />}
            </div>
        </div>
    );
}

export default Page;