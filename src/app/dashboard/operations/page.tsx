"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, {useEffect} from "react";
import {RequestStatus, RequestType} from "@/app/constants/types";
import {submitRequest} from "@/app/api/request/RequestAPI";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import {getRequestsFromCompany} from "@/app/api/company/CompanyAPI";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {ArrowDownCircleIcon, ArrowUpCircleIcon, CheckCircleIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import OperationRequestForm from "@/app/dashboard/operations/OperationRequestForm";
import ActionButton from "@/app/components/dashboard/ActionButton";
import DashboardWidget from "@/app/components/dashboard/DashboardWidget";
import {getOperationWidgetData} from "@/app/api/finance/FinanceAPI";


const operationHeaders = [
    {name: 'Condo Name', key: 'condo_name'},
    {name: 'Request Type', key: 'request_type'},
    {name: 'Date Submitted', key: 'date_submitted'},
    {name: 'Cost ($)', key: 'amount'},
    {name: 'Status', key: 'status'},
    {name: 'Assigned To', key: 'assigned_to'},
    {name: 'Actions', key: 'actions'}
]

interface operationWidgetDataType {
    budget: number;
    costs: number;
    paid_amount: number;
}

function Page(){
    const [operationRequestData, setOperationRequestData] = React.useState<RequestType[]>([]);
    const [editingRequest, setEditingRequest] = React.useState<boolean>();
    const [filteredRequestData, setFilteredRequestData] = React.useState<any[]>([]);
    const [selectedRequest, setSelectedRequest] = React.useState<RequestType>({} as RequestType);
    const [userId, setUserId] = React.useState<string>();
    const [widgetData, setWidgetData] = React.useState<operationWidgetDataType>({} as operationWidgetDataType);

    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    const onEdit = async(request: RequestType) =>{
        setEditingRequest(true);
        setSelectedRequest(request);
    }

    const submitEdit = async() => {
        if(!selectedRequest) return;
        // Set new status
        let newStatus: RequestStatus = selectedRequest.status;
        if(!selectedRequest.assigned_to && selectedRequest.amount)
            newStatus = RequestStatus.APPROVED;
        if(selectedRequest.assigned_to && selectedRequest.amount)
            newStatus = RequestStatus.IN_PROGRESS;
        const updatedRequest = {...selectedRequest, status: newStatus};
        delete updatedRequest.condo;
        delete updatedRequest.employee
        await submitRequest(updatedRequest).then(res => {
            console.log(res)
            window.location.reload();
        })
    }

    const finishRequest = async(request: RequestType) => {
        const confirmation = confirm("Are you sure you want to finish this request?")
        if(!confirmation) return;
        const updatedRequest = {...request, status: RequestStatus.COMPLETED};
        delete updatedRequest.condo;
        delete updatedRequest.employee
        await submitRequest(updatedRequest).then(res => {
            window.location.reload();
        })
    }

    const denyRequest = async(request: RequestType) => {
        const confirmation = confirm("Are you sure you want to deny this request?")
        if(!confirmation) return;
        const updatedRequest = {...request, status: RequestStatus.DENIED};
        delete updatedRequest.condo;
        delete updatedRequest.employee
        await submitRequest(updatedRequest).then(res => {
            window.location.reload();
        })
    }

    const fetchOperationRequestData = async () => {
        const {data, error} = await getRequestsFromCompany(userId);
        if(error){
            console.log(error)
            return
        }
        if(data) setOperationRequestData(data)
    }

    const fetchOperationWidgetData = async() => {
        // Retrieve operational budget
        const {data, error} = await getOperationWidgetData(userId);
        if(data) setWidgetData(data as unknown as operationWidgetDataType);
    }

    useEffect(() => {
        if(!userId) return;
        fetchOperationWidgetData().catch(console.error)
    }, [operationRequestData, userId]);

    useEffect(() => {
        if(userId) fetchOperationRequestData().catch(console.error);
    }, [userId]);

    useEffect(() => {
        if (operationRequestData.length === 0) return;
        let filteredData;

        filteredData = operationRequestData.map((operationRequest) => {
            const requestStatusColor = {
                'PENDING': 'bg-yellow-100 text-yellow-700',
                'COMPLETED': 'bg-green-100 text-green-700',
                'APPROVED': 'bg-teal-100 text-teal-700',
                'REJECTED': 'bg-red-100 text-red-700',
                'IN PROGRESS': 'bg-amber-100 text-amber-700',
                'PAYMENT DUE': 'bg-lime-100 text-lime-700',
                'DENIED': 'bg-red-100 text-red-700'
            }

            return {
                id: operationRequest.id,
                condo_name: operationRequest.condo?.name,
                request_type: operationRequest.type,
                date_submitted: operationRequest.date,
                amount: operationRequest.amount ? operationRequest.amount.toFixed(2) : 'Unset',
                status: <div
                    className={`mx-auto rounded-md py-[2px] w-[120px] px-3 ${requestStatusColor[operationRequest.status as unknown as
                        keyof typeof requestStatusColor
                        ]}`}>
                    {operationRequest.status.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                </div>,
                assigned_to: operationRequest.assigned_to ? (operationRequest.employee?.name) : 'Unassigned',
                actions:
                    <div className={"flex flex-row gap-3 px-2"}>
                        <ActionIcon Icon={PencilSquareIcon} onClick={() => onEdit(operationRequest)}/>
                        <ActionButton
                            text={'Deny'}
                            onClick={() => denyRequest(operationRequest)}
                            disabled={operationRequest.status !== RequestStatus.PENDING}/>
                    </div>
            }
        });
        // sort by id in descending order
        filteredData.sort((a, b) => b.id - a.id);
        setFilteredRequestData(filteredData);
    }, [operationRequestData]);


    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={`min-w-0 ${editingRequest ? 'max-w-full' : 'max-w-fit'} `}>
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-row gap-4"}>
                        <DashboardWidget
                            icon={ArrowDownCircleIcon}
                             icon_color={"bg-blue-500"}
                             title={"Operational Budget"}
                             value={`$${(widgetData.budget - widgetData.paid_amount)?.toFixed(2) || '0'}`}
                        />
                        <DashboardWidget
                            icon={ArrowUpCircleIcon}
                            icon_color={"bg-orange-600"}
                            title={"Active Operational Costs"}
                            value={`$${widgetData.costs?.toFixed(2) || '0'}`}
                        />
                        <DashboardWidget
                            icon={CheckCircleIcon}
                            icon_color={"bg-green-600"}
                            title={"Total Amount Paid"}
                            value={`$${widgetData.paid_amount?.toFixed(2) || '0'}`}
                        />
                    </div>
                    <DashboardPanel
                        title={'Operation Requests'}
                        children={<DashboardTable items={filteredRequestData} headers={operationHeaders}/>}
                    />
                </div>
            </div>
            {editingRequest &&
                <div className={"min-w-[370px]"}>
                <DashboardPanel
                    title={"Edit Request"}
                    children={<OperationRequestForm
                        company_id={userId as string}
                        request={selectedRequest}
                        setRequest={setSelectedRequest}
                    />}
                    buttonTitle={'Submit'}
                    onClick={() => submitEdit()}
                />
            </div>}
        </div>
    );

}

export default Page;