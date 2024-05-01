"use client"
import React, {useEffect} from 'react';
import {CondoUnitType, UserType} from "@/app/constants/types";
import FinanceUnitInfo from "@/app/dashboard/finances/FinanceUnitInfo";
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import {getCondosFromCompany, getCondosFromOccupant} from "@/app/api/property/PropertyAPI";
import ActionButton from "@/app/components/dashboard/ActionButton";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {
    ArrowDownCircleIcon,
    ArrowUpCircleIcon,
    ArrowUpRightIcon,
    CheckCircleIcon,
    EllipsisHorizontalCircleIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import FinancePaymentsView from "@/app/dashboard/finances/FinancePaymentsView";
import {getCondoPaymentData, getFinanceWidgetData, PaymentStatus, updateCondoFee} from "@/app/api/finance/FinanceAPI";
import DashboardWidget from "@/app/components/dashboard/DashboardWidget";

const financialHeaders = [
    {name: 'ID', key: 'id'},
    {name: 'Condo Name', key: 'name'},
    {name: 'Condo Fee ($)', key: 'condo_fee'},
    {name: 'Parking Fee ($)', key: 'parking_fee'},
    {name: 'Locker Fee ($)', key: 'locker_fee'},
    {name: 'Total Fee ($)', key: 'total_fee'},
    {name: 'Amount Due', key: 'amount_due'},
    {name: 'Payment Status', key: 'status'},
    {name: 'Actions', key: 'actions'},
]

interface financeWidgetDataType {
    totalAmountDue: number;
    totalAmountPaid: number;
    totalUnits: number;
    paidUnits: number;
    unpaidUnits: number;
    incompleteUnits: number;
}

function Page() {
    const [userType, setUserType] = React.useState<string>();
    const [userId, setUserId] = React.useState<string>();
    const [condoUnits, setCondoUnits] = React.useState<CondoUnitType[]>([]);
    const [selectedUnit, setSelectedUnit] = React.useState<CondoUnitType>();
    const [filteredUnits, setFilteredUnits] = React.useState<any[]>([]);
    const [showUnitForm, setShowUnitForm] = React.useState<boolean>(false);
    const [showPaymentsView, setShowPaymentsView] = React.useState<boolean>(false);
    const [widgetData, setWidgetData] = React.useState<financeWidgetDataType>({} as financeWidgetDataType);

    const generateAnnualReport = async () => {
        // Generate annual report
    }

    const saveChanges = async () => {
        // Update unit
        if(!selectedUnit) return;
        updateCondoFee(selectedUnit.id, selectedUnit?.fee).catch(console.error);
    }

    const editUnit = (unit: CondoUnitType) => {
        setSelectedUnit(unit);
        setShowUnitForm(true);
    }

    const viewPayments = (unit: CondoUnitType) => {
        setSelectedUnit(unit);
        setShowPaymentsView(true);
    }

    const makePayment = (unit: CondoUnitType, amount_due: number) => {
        // Redirect to payment page with id=id and type=CONDO and amount_due=amount_due
        const url = `/dashboard/payments?id=${unit.id}&type=CONDO`;
        window.location.href = url
    }

    const fetchFinancialData = async () => {
        if(!userType || !userId) return;
        const userTypeToFunction = {
            [UserType.COMPANY]: getCondosFromCompany,
            [UserType.OWNER]: getCondosFromOccupant,
            [UserType.RENTER]: getCondosFromOccupant,
        };
        const fetchFunction = userTypeToFunction[userType as keyof typeof userTypeToFunction];
        if (fetchFunction) {
            const { data, error } = await fetchFunction(userId);
            if (error) {
                console.log(error);
                return;
            }
            if (data) setCondoUnits(data);
        }
    }

    const fetchWidgetData = async () => {
        if(!userId || !userType) return;
        const {data: widgetData, error: widgetError} = await getFinanceWidgetData(userId, userType as UserType);
        if(widgetError){
            console.log(widgetError)
            return
        }
        if(widgetData) setWidgetData(widgetData);
    }

    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string);
        setUserType(localStorage.getItem('user_role') as string);
    }, []);

    useEffect(() => {
        let filteredUnits = condoUnits.map((unit) => {
            const {data} = getCondoPaymentData(unit);
            const statusColor = {
                'Paid': 'bg-green-100 text-green-700',
                'Incomplete': 'bg-orange-100 text-orange-700',
                'Overdue': 'bg-red-100 text-red-700',
                'Unpaid': 'bg-red-100 text-red-700',
                'Unoccupied' : 'bg-gray-200 text-gray-600',
            };

            return {
                id: unit.id,
                name: unit.name,
                size: unit.size,
                condo_fee: data.condo_fee.toFixed(2).toString(),
                parking_fee: data.parking_fee.toFixed(2).toString(),
                locker_fee: data.locker_fee.toFixed(2).toString(),
                total_fee: data.total_fee.toFixed(2).toString(),
                amount_due: data.amount_due.toFixed(2).toString(),
                status:
                    <div className={`mx-auto rounded-md py-[2px] w-[120px] px-3 ${statusColor[data.status]} `}>
                        {data.status}
                    </div>,
                actions:
                    <div className={"flex flex-row gap-3"}>
                        {(userType === UserType.RENTER || userType === UserType.OWNER)  &&
                        <ActionButton text={'Make Payment'} onClick={() => makePayment(unit, data.amount_due)} disabled={data.status === PaymentStatus.PAID}/>}
                        <ActionButton text={'View Payments'} onClick={() => viewPayments(unit)}/>
                        <ActionIcon onClick={() => editUnit(unit)} Icon={ArrowUpRightIcon}/>
                    </div>,
            }
        });
        // sort by condo name
        filteredUnits.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredUnits(filteredUnits || []);
    }, [condoUnits]);

    useEffect(() => {
        if(!userId) return
        fetchWidgetData().catch(console.error);
        fetchFinancialData().catch(console.error);
    }, [userId]);

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            {(selectedUnit && showPaymentsView) &&
                <FinancePaymentsView
                    unit={selectedUnit}
                    isVisible={showPaymentsView}
                    setIsVisible={setShowPaymentsView}
                />}
            <div className={"min-w-0 max-w-fit"}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-row gap-4"}>
                        <DashboardWidget icon={ArrowUpCircleIcon} icon_color={"bg-blue-600"} title={"Total Amount Paid"}
                                            value={`$${widgetData.totalAmountPaid?.toFixed(2) || '0'}`}/>
                        <DashboardWidget icon={ArrowDownCircleIcon} icon_color={"bg-orange-600"} title={"Total Amount Due"}
                                            value={`$${widgetData.totalAmountDue?.toFixed(2) || '0'}`}/>
                        <DashboardWidget icon={CheckCircleIcon} icon_color={"bg-green-600"} title={"Paid Units"}
                                            value={`${widgetData.paidUnits || '0'}` + (widgetData.paidUnits === 1 ? ' unit' : ' units')}/>
                        <DashboardWidget icon={EllipsisHorizontalCircleIcon} icon_color={"bg-amber-500"} title={"Incomplete Units"}
                                            value={`${widgetData.incompleteUnits || '0'}` + (widgetData.incompleteUnits === 1 ? ' unit' : ' units')}/>
                        <DashboardWidget icon={ExclamationTriangleIcon} icon_color={"bg-red-600"} title={"Unpaid Units"}
                                            value={`${widgetData.unpaidUnits || '0'}` + (widgetData.unpaidUnits === 1 ? ' unit' : ' units')}/>
                    </div>
                    <DashboardPanel
                        title={'Units Finances'}
                        buttonTitle={userType === UserType.COMPANY ? 'Generate Annual Report' : undefined}
                        onClick={() => generateAnnualReport()}
                        content={<DashboardTable items={filteredUnits} headers={financialHeaders}/>}
                    />
                </div>
            </div>
            <div className={`${(showUnitForm && selectedUnit) ? '' : 'hidden'} min-w-[370px]`}>
                {(showUnitForm && selectedUnit) && <DashboardPanel
                    title={selectedUnit.name}
                    content={<FinanceUnitInfo
                        userType={userType as UserType}
                        unit={selectedUnit as CondoUnitType}
                        setUnit={setSelectedUnit}
                        />
                    }
                    buttonTitle={userType === UserType.COMPANY ? 'Save Changes' : undefined}
                    closable={true}
                    onClick={saveChanges}
                />}
            </div>
        </div>
    );
}

export default Page;