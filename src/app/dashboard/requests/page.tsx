
"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, {useEffect, useState} from "react";
import {RequestStatus, RequestType} from "@/app/constants/types";
import {getRequestDataFromOwner, submitRequest} from "@/app/api/request/RequestAPI";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import RequestForm from "./RequestForm";
import {getCondoIDFromName, getCondosFromOccupant} from "@/app/api/property/PropertyAPI";


const requestTableHeaders = [
    {name: 'Condo Name', key: 'condo_name'},
    {name: 'Request Type', key: 'request_type'},
    {name: 'Date Submitted', key: 'date_submitted'},
    {name: 'Amount', key: 'amount'},
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
        console.log(userId)
        const {data: requestData, error:requestError} = await getRequestDataFromOwner(userId);
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
            console.log(request)
            return{
                condo_name: request.unit?.name,
                request_type: request.type,
                date_submitted: request.date,
                amount: request.amount || 'Unset',
                status: request.status
            }
        }); 
        setFilteredRequestData(filteredData);
        console.log(filteredData);
    }, [requestData]);

    const submitNewRequest = async () => {
        if(!newType || !newCondoName || !newDescription) return;
        const response = await getCondoIDFromName(newCondoName).catch(console.error);
        const data = response?.data;
        console.log({
            description: newDescription,
            type: newType,
            unit_id: data?.[0]?.id,
            status: RequestStatus.PENDING,
            user_id: userId,
            date: new Date().toISOString()
        })

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
              title={'Requests'}
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