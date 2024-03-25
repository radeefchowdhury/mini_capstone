
"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, {useEffect} from "react";
import {RequestStatus, RequestType} from "@/app/constants/types";
import {submitRequest} from "@/app/api/request/RequestAPI";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import {getRequestsFromCompany} from "@/app/api/company/CompanyAPI";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import OperationRequestForm from "@/app/dashboard/operations/OperationRequestForm";
import ActionButton from "@/app/components/dashboard/ActionButton";


const operationHeaders = [
    {name: 'Condo Name', key: 'condo_name'},
    {name: 'Request Type', key: 'request_type'},
    {name: 'Date Submitted', key: 'date_submitted'},
    {name: 'Amount', key: 'amount'},
    {name: 'Status', key: 'status'},
    {name: 'Assigned To', key: 'assigned_to'},
    {name: 'Actions', key: 'actions'}
]

function Page(){
    const [operationRequestData, setOperationRequestData] = React.useState<RequestType[]>([]);
    const [editingRequest, setEditingRequest] = React.useState<boolean>();
    const [filteredRequestData, setFilteredRequestData] = React.useState<any[]>([]);
    const [selectedRequest, setSelectedRequest] = React.useState<RequestType>({} as RequestType);
    const [userId, setUserId] = React.useState<string>();

    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    const fetchOperationRequestData = async () => {
      console.log(userId)
        const {data, error} = await getRequestsFromCompany(userId);
        if(error){
            console.log(error)
            return
        }
        console.log(data);
       if(data) setOperationRequestData(data)
    }

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
        if(selectedRequest.assigned_to && !selectedRequest.amount)
            newStatus = RequestStatus.ASSIGNED;
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

    const completeRequest = async(request: RequestType) => {
        const updatedRequest = {...request, status: RequestStatus.COMPLETED};
        delete updatedRequest.condo;
        delete updatedRequest.employee
        await submitRequest(updatedRequest).then(res => {
            window.location.reload();
        })
    }

    useEffect(() => {
        if(userId) fetchOperationRequestData().catch(console.error);
    }, [userId]);

    useEffect(() => {
        if (operationRequestData.length === 0) return;
        let filteredData;

        filteredData = operationRequestData.map((operationRequest) => {
        return {
            id: operationRequest.id,
            condo_name: operationRequest.condo?.name,
            request_type: operationRequest.type,
            date_submitted: operationRequest.date,
            amount: operationRequest.amount ? operationRequest.amount : 'Unset',
            status: operationRequest.status,
            assigned_to: operationRequest.assigned_to ? (operationRequest.employee?.name) : 'Unassigned',
            actions:
            <div className={"flex flex-row gap-3 px-2"}>
                <ActionIcon Icon={PencilSquareIcon} onClick={() => onEdit(operationRequest)} />
                <ActionButton title={'Complete'} onClick={() => completeRequest(operationRequest)} />
            </div>
            }
        });
        // sort by id in descending order
        filteredData.sort((a, b) => b.id - a.id);
        setFilteredRequestData(filteredData);
        console.log(filteredData);
    }, [operationRequestData]);



    
    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={`min-w-0 ${editingRequest ? 'max-w-full' : 'max-w-fit'} `}>
                <DashboardPanel
                    title={'Operation Requests'}
                    children={<DashboardTable items={filteredRequestData} headers={operationHeaders}/>}
                />
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