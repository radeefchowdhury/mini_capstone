
"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, { use, useEffect, useState } from "react";
import {RequestType} from "@/app/constants/types";
import { getRequestDataFromCondoName, getRequestDataFromOwner, submitRequest } from "@/app/api/request/RequestAPI";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import RequestForm from "./RequestForm";
import { getCondoIDFromName } from "@/app/api/property/PropertyAPI";


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
    const [newRequest, setNewRequest] = React.useState<RequestType>({} as RequestType);
    const [userId, setUserId] = React.useState<string>();
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [newRequestData, setNewRequestData] = React.useState<RequestType[]>([]);
    const [newCondoName, setNewCondoName] = React.useState<string>("");
    const [newType, setNewType] = React.useState<string>("");
    const [newDescription, setNewDescription] = React.useState<string>("");



    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string);
    }, []);


    const fetchRequestData = async () => {
        console.log(userId)
        const {data, error} = await getRequestDataFromOwner(userId);
        if(error){
            console.log(error)
            return
        }
        if(data) setRequestData(data)
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
                amount: request.amount,
                status: request.status
            }
        }); 
        setFilteredRequestData(filteredData);
        console.log(filteredData);
    }, [requestData]);


    const submitNewRequest = async () => {
        console.log('Condo Name ', newCondoName)

        const response = await getCondoIDFromName(newCondoName).catch(console.error);
        console.log(response)

        const data = response?.data;
        console.log(data?.[0]?.id);


        const requestToSubmit = {
            description: newDescription,
            type: newType,
            unit_id: data?.[0]?.id,
            status: 'PENDING',
            user_id: userId,
            date: new Date().toISOString()
        }
        submitRequest(requestToSubmit)
        setShowRequestForm(false);

        }
    
    
    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
          <div>
            <DashboardPanel
              title={'Requests'}
              buttonTitle={'Create New Request'}
              children={<DashboardTable items={filteredRequestData} headers={requestTableHeaders} />}
              onClick={() => setShowRequestForm(true)}
            />
          </div>
          {showRequestForm && (
            <DashboardPanel
              title={'New Request'}
              buttonTitle={'Submit'}
              children={<RequestForm 
                          condo_name={newCondoName} setCondoName={setNewCondoName}   
                          type={newType} setType={setNewType}
                          description={newDescription} setDescription={setNewDescription}
                        />}
              onClick={submitNewRequest}
            />
          )}
        </div>
      );
      
}
export default Page;