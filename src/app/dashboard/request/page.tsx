"use client"
import React, {useEffect} from 'react';
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import {RequestStatus, RequestType} from "@/app/constants/types";
import {getAssignedRequests, submitRequest} from "@/app/api/request/RequestAPI";
import ActionButton from "@/app/components/dashboard/ActionButton";

const requestTableHeaders = [
    {name: 'Condo Name', key: 'condo_name'},
    {name: 'Condo Number', key: 'condo_number'},
    {name: 'Request Type', key: 'request_type'},
    {name: 'Date Submitted', key: 'date_submitted'},
    {name: 'Cost ($)', key: 'amount'},
    {name: 'Status', key: 'status'},
    {name: 'Actions', key: 'actions'}
]

function Page() {

    const [requests, setRequests] = React.useState<RequestType[]>([]);
    const [filteredRequests, setFilteredRequests] = React.useState<any[]>([]);
    const [userId, setUserId] = React.useState<string>();



    const fetchRequestData = async () => {
        getAssignedRequests(userId).then(({data, error}) => {
            if(error){
                console.log(error)
                return
            }
            console.log(data)
            if(data) setRequests(data)
        })
    }

    const completeRequest = async (request: RequestType) => {
        // Mark request as completed
        request.status = 'COMPLETED' as RequestStatus;
        // delete columns: condo, employee from request
        delete request.condo;
        delete request.employee;
        await submitRequest(request).then(res => {
            fetchRequestData().catch(console.error)
        })
    }

    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    useEffect(() => {
        if(userId) fetchRequestData().catch(console.error);
    }, [userId]);

    useEffect(() => {
        setFilteredRequests(requests.map((request) => {
            const formattedAmount = request.amount ? `${request.amount.toFixed(2)}` : 'Unset';
            const requestStatusColor = {
                'PENDING': 'bg-yellow-100 text-yellow-700',
                'COMPLETED': 'bg-green-100 text-green-700',
                'APPROVED': 'bg-teal-100 text-teal-700',
                'REJECTED': 'bg-red-100 text-red-700',
                'IN PROGRESS': 'bg-amber-100 text-amber-700',
                'DENIED': 'bg-red-100 text-red-700'
            }
            console.log(request)
            return {
                condo_name: request.condo?.name,
                condo_number: request.condo?.number,
                request_type: request.type,
                date_submitted: request.date,
                amount: formattedAmount,
                status: <div className={`mx-auto rounded-md py-[2px] w-[120px] px-3 ${requestStatusColor[request.status as unknown as
                    keyof typeof requestStatusColor
                    ]}`}>
                    {request.status.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                </div>,
                actions: <ActionButton text={'Mark as Completed'} onClick={() => completeRequest(request)} />
        }}))

    }, [requests]);

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={"min-w-0 max-w-full"}>
                <DashboardPanel
                    title={'My Requests'}
                    content={<DashboardTable
                    items={filteredRequests}
                    headers={requestTableHeaders} />}
                    />
            </div>
        </div>
    );
}

export default Page;