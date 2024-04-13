"use client"
import React, {useEffect} from 'react';
import {CondoUnitType, PaymentType} from "@/app/constants/types";
import PopupPanel from "@/app/components/dashboard/PopupPanel";
import DashboardTable from "@/app/components/dashboard/DashboardTable";

interface PaymentsViewProps {
    unit: CondoUnitType;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
}

const paymentsTableHeaders = [
    {name: 'ID', key: 'id'},
    {name: 'Date', key: 'date'},
    {name: 'Amount ($)', key: 'amount'},
]


function FinancePaymentsView(props: PaymentsViewProps) {
    const {unit, isVisible, setIsVisible} = props;
    const [filteredPayments, setFilteredPayments] = React.useState<any[]>([]);

    useEffect(() => {
        let payments = unit.payments.map((payment: PaymentType) => {
            // Format the date to be more readable
            // dd/mm/yyyy hh:mm pm/am
            const date = new Date(payment.created_at);
            const formattedDate = date.toLocaleString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            return {
                id: payment.id,
                date: formattedDate,
                amount: payment.amount.toFixed(2)
            }
        })
        setFilteredPayments(payments)
    }, [unit]);



    return (
            <PopupPanel
                title={'Payments: ' + unit.name}
                visible={isVisible}
                setVisible={setIsVisible}
                children={
                <div className={"w-fit"}>
                    <DashboardTable
                        items={filteredPayments || []}
                        headers={paymentsTableHeaders}
                    />
                    {unit.payments.length === 0 &&
                        <div className={"text-slate-500 font-medium text-center mt-4"}>
                            No payments found
                        </div>
                    }
                </div>}
            />
    );
}

export default FinancePaymentsView;