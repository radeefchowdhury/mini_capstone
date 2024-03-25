
"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, { use, useEffect, useState } from "react";
import {RequestType} from "@/app/constants/types";
import { getRequestDataFromCondoName, getRequestDataFromOwner, submitRequest } from "@/app/api/request/RequestAPI";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import { getCondoIDFromName, getCondosFromCompany } from "@/app/api/property/PropertyAPI";
import { getRequestsFromCompany } from "@/app/api/company/CompanyAPI";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {PencilSquareIcon} from "@heroicons/react/24/outline";


const operationHeaders = [
  {name: 'Request Type', key: 'request_type'},
  {name: 'Date Submitted', key: 'date_submitted'},
  {name: 'Amount', key: 'amount'},
  {name: 'Status', key: 'status'},
  {name: 'Assigned To', key: 'assigned_to'},
  {name: 'Edit', key: 'editbutton'}
]


function Page(){

    const [operationRequestData, setOperationRequestData] = React.useState<RequestType[]>([]);
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


    const fetchOperationRequesData = async () => {
      console.log(userId)
        const {data, error} = await getRequestsFromCompany(userId);
        if(error){
            console.log(error)
            return
        }
        console.log(data);
       if(data) setOperationRequestData(data)
    }

    const onEdit = async() =>{
      console.log("Edit");
    
    }

    useEffect(() => {
      if(userId) fetchOperationRequesData().catch(console.error);
  }, [userId]);



  useEffect(() => {
    if (operationRequestData.length === 0) return;
    let filteredData;

    filteredData = operationRequestData.map((operationRequest) => {
      return {
        request_type: operationRequest.type,
        date_submitted: operationRequest.date,
        amount: operationRequest.amount,
        status: operationRequest.status,
        assigned_to: operationRequest.assigned_to,
        edit: <ActionIcon Icon={PencilSquareIcon} onClick={onEdit} />,
      };
    });
    setFilteredRequestData(filteredData);
    console.log(filteredData);
}, [operationRequestData]);



    
    return (
      <div>
      <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
        <DashboardPanel
          title={'Operation Requests'}
          children={<DashboardTable items={filteredRequestData} headers={operationHeaders} />}
          onClick={() => setShowRequestForm(true)}
        />
      </div>
      </div>
      );
      
}
export default Page;