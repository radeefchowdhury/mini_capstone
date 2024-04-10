import React, {useEffect} from 'react';
import {CardInfoType, CondoUnitType, RequestStatus, RequestType} from "@/app/constants/types";
import {
    getCardInfoByUserID,
    getCondoPaymentData,
    getRequestByID,
    getRequestPaymentData,
    PaymentStatus
} from "@/app/api/finance/FinanceAPI";
import CardInfoForm from "@/app/components/dashboard/CardInfoForm";
import {getCondoUnitByID} from "@/app/api/property/PropertyAPI";

interface PaymentInfoProps {
    payment: any;
    userId: string;
    setPayment: (payment: any) => void;
    condos: CondoUnitType[];
    requests: RequestType[];
    cardInfo: CardInfoType;
    setCardInfo: (cardInfo: CardInfoType) => void;
    error?: string;
}

function PaymentInfo(props: PaymentInfoProps) {
    const {
        payment,
        setPayment,
        condos,
        requests,
        userId,
        cardInfo,
        setCardInfo
    } = props;

    const [paymentData, setPaymentData] = React.useState<any>({});

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const re = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers and at most one decimal point
        const countDecimals = (value: string) => {
            const numValue = Number(value);
            if (Math.floor(numValue) !== numValue)
                return value.split(".")[1]?.length || 0;
            return 0;
        };
        // Convert input value to a float
        const inputVal = parseFloat(e.target.value);
        // Check if the input is empty, matches the regex, has two or fewer decimals, and is not greater than amountDue
        if (e.target.value === '' ||
            (re.test(e.target.value) &&
                countDecimals(e.target.value) <= 2 &&
                inputVal <= paymentData.amount_due)) {
            setPayment({...payment, amount: e.target.value});
        }
    }

    const fetchCardInfo = async () => {
        const {data, error} = await getCardInfoByUserID(userId);
        if(error){
            console.log(error)
            return
        }
        if(data && data[0].card_info) setCardInfo(data[0].card_info as unknown as CardInfoType)
    }

    const retrieveAmountDueString =  ()  => {
        if(paymentData.status === PaymentStatus.PAID) return ' (fully paid)';
        if(paymentData.status === PaymentStatus.UNPAID) return ` (due: ${paymentData.amount_due.toFixed(2)})`;
        if(paymentData.status === PaymentStatus.INCOMPLETE) return ` (due: ${paymentData.amount_due.toFixed(2)})`;
        if(paymentData.status === PaymentStatus.OVERDUE) return ` (overdue by: ${Math.abs(paymentData.amount_due).toFixed(2)})`;
        return ''
    }

    const getAmountDue = async () => {
        if(payment.type === 'REQUEST' && payment.request_id){
            const { data, error } = await getRequestByID(payment.request_id);
            if(data) {
                const {data: paymentData} = getRequestPaymentData(data[0])
                setPaymentData(paymentData)
            }
        }
        else if(payment.type === 'CONDO' && payment.unit_id){
            const { data, error } = await getCondoUnitByID(payment.unit_id);
            if(data) {
                const {data: paymentData} = getCondoPaymentData(data[0])
                setPaymentData(paymentData)
            }
        }
        else setPaymentData({})
    }

    useEffect(() => {
        fetchCardInfo().catch(console.error);
    }, []);

    useEffect(() => {
        console.log(payment)
        getAmountDue().catch(console.error)
    }, [payment.request_id, payment.unit_id, payment.type]);

    return (
        <div className={"-mb-3 text-slate-500 font-medium flex flex-col gap-3"}>
            <div className="flex flex-col gap-1">
                <label htmlFor="Type" className="">Type</label>
                <div className="flex flex-row gap-3">
                    <div>
                        <input
                            className={"mr-1"}
                            type="radio"
                            id="condo"
                            name="type"
                            value="CONDO"
                            checked={payment.type === 'CONDO'}
                            onChange={(e) => setPayment({...payment, type: e.target.value})}
                        />
                        <label htmlFor="condo">Condo</label>
                    </div>
                    <div>
                        <input
                            className={"mr-1"}
                            type="radio"
                            id="request"
                            name="type"
                            value="REQUEST"
                            checked={payment.type === 'REQUEST'}
                            onChange={(e) => setPayment({...payment, type: e.target.value})}
                        />
                        <label htmlFor="request">Request</label>
                    </div>
                </div>
            </div>
            {payment.type === "REQUEST" &&
                <div className="flex flex-col gap-1 font-inter bg-white">
                    <label htmlFor="Requests" className="">Requests</label>
                    <select
                        value={payment.request_id || ""}
                        onChange={(e) => setPayment({...payment, request_id: e.target.value})}
                        id="request_id"
                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md font-inter bg-white">
                        <option className={"text-slate-600"} value={""} disabled>Select Request</option>
                        {requests.map((request) => {
                            if(request.status !== RequestStatus.PAYMENT_DUE) return
                            return <option
                                className={"text-slate-600"}
                                key={request.id}
                                value={request.id}>{request.condo?.name}: {request.type} (id: {request.id})
                            </option>}
                        )}
                    </select>
                </div>}
            {payment.type === "CONDO" &&
                <div className="flex flex-col gap-1 font-inter bg-white">
                    <label htmlFor="Condo" className="">Condo</label>
                    <select
                        value={payment.unit_id || ""}
                        onChange={(e) => setPayment({...payment, unit_id: e.target.value})}
                        id="unit_id"
                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md font-inter bg-white">
                        <option value={""} disabled>Select Condo</option>
                        {condos.map((condo) => (
                            <option
                                className={"text-slate-600"}
                                key={condo.id}
                                value={condo.id}>{condo.name} (id: {condo.id})
                            </option>
                        ))}
                    </select>
                </div>}
            <div className="flex flex-col gap-1">
                <label htmlFor="Amount" className="">Amount
                    { Object.keys(paymentData).length !== 0 &&<span className={"font-normal"}>
                        {retrieveAmountDueString()}
                    </span> }
                </label>
                <input
                    value={payment.amount || ""}
                    onChange={handleAmountChange}
                    type="text" id="amount"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <hr className="-mx-2 my-2 border-slate-300"/>
            <span className={"text-lg text-slate-600 font-medium"}>Card Information</span>
            <CardInfoForm cardInfo={cardInfo} setCardInfo={setCardInfo} from={"PAYMENT"}/>
            {props.error && <div className={"text-red-500"}>{props.error}</div>}
        </div>
    );
}

export default PaymentInfo