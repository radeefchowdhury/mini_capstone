"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, {useEffect, useState} from "react";
import {RequestStatus, RequestType} from "@/app/constants/types";
import {getRequestsFromOccupant, submitRequest} from "@/app/api/request/RequestAPI";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import RequestForm from "./RequestForm";
import {getCondoIDFromName, getCondosFromOccupant} from "@/app/api/property/PropertyAPI";


const requestTableHeaders = [
    {name: 'Condo Name', key: 'condo_name'},
    {name: 'Request Type', key: 'request_type'},
    {name: 'Date Submitted', key: 'date_submitted'},
    {name: 'Cost ($)', key: 'amount'},
    {name: 'Status', key: 'status'},
]


function Page(){

    const [requestData, setRequestData] = React.useState<RequestType[]>([]);
    const [filteredRequestData, setFilteredRequestData] = React.useState<any[]>([]);
    const [userId, setUserId] = React.useState<string>();
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [newCondoName, setNewCondoName] = React.useState<string>("");
    const [newType, setNewType] = React.useState<string>("");
    const [newDescription, setNewDescription] = React.useState<string>("");
    const [condoNames, setCondoNames] = React.useState<string[]>([]);


    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    const fetchRequestData = async () => {
        const {data: requestData, error:requestError} = await getRequestsFromOccupant(userId);
        if(requestError){
            console.log(requestError)
            return
        }
        const {data: condoList, error:condoError} = await getCondosFromOccupant(userId);
        let condoNames = condoList?.map((condo) => condo.name) || [];
        if(requestData) setRequestData(requestData)
        setCondoNames(condoNames)
    }

    useEffect(() => {
        if(userId) fetchRequestData().catch(console.error);
    }, [userId]);

    useEffect(() => {
        if(requestData.length === 0) return;
        let filteredData;
        filteredData = requestData.map((request) => {
            const formattedAmount = request.amount ? `${request.amount.toFixed(2)}` : 'Unset';
            const requestStatusColor = {
                'PENDING': 'bg-yellow-100 text-yellow-700',
                'COMPLETED': 'bg-green-100 text-green-700',
                'APPROVED': 'bg-teal-100 text-teal-700',
                'REJECTED': 'bg-red-100 text-red-700',
                'IN PROGRESS': 'bg-amber-100 text-amber-700',
                'DENIED': 'bg-red-100 text-red-700'
            }

            return{
                id: request.id,
                condo_name: request.condo?.name,
                request_type: request.type,
                date_submitted: request.date,
                amount: formattedAmount,
                status: <div className={`mx-auto rounded-md py-[2px] w-[120px] px-3 ${requestStatusColor[request.status as unknown as
                    keyof typeof requestStatusColor
                    ]}`}>
                    {request.status.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                </div>,

            }
        });
        // sort by id
        filteredData.sort((a, b) => b.id - a.id);
        setFilteredRequestData(filteredData);
    }, [requestData]);

    const submitNewRequest = async () => {
        if(!newType || !newCondoName || !newDescription) return;
        const response = await getCondoIDFromName(newCondoName).catch(console.error);
        const data = response?.data;

        const requestToSubmit = {
            description: newDescription,
            type: newType,
            unit_id: data?.[0]?.id,
            status: RequestStatus.PENDING,
            user_id: userId,
            date: new Date().toISOString()
        }
        await submitRequest(requestToSubmit).then(() => {
                window.location.reload()
            }).catch(console.error);
        setShowRequestForm(false);
    }

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
          <div className={"min-w-0 max-w-full"}>
            <DashboardPanel
              title={'My Requests'}
              buttonTitle={'Create New Request'}
              children={<DashboardTable items={filteredRequestData} headers={requestTableHeaders} />}
              onClick={() => setShowRequestForm(true)}
            />
          </div>
          {showRequestForm && (
              <div className={"xl:max-w-[370px]"}>
                <DashboardPanel
                  title={'New Request'}
                  buttonTitle={'Submit'}
                  children={<RequestForm
                              condo_name={newCondoName} setCondoName={setNewCondoName}
                              type={newType} setType={setNewType}
                              description={newDescription} setDescription={setNewDescription}
                              condos={condoNames}
                            />}
                  onClick={submitNewRequest}
                />
              </div>
          )}
        </div>
      );
      
}
export default Page;