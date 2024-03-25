import React from 'react';

interface RequestFormProps {
    request_type: string;
    date_submitted: string;
    amount: number;
    assigned_to: string;
    status: string;


    setRequestType: (request_type: string) => void;
    setDateSubmitted: (date_submitted: string) => void;
    setAmount: (amount: number) => void;
    setAssignedTo: (assigned_to: string) => void;
    setStatus: (status: string) => void;
    
}

function RequestForm(props: RequestFormProps) {
    const handleSubmit = () => {
    };

    return (
        <div className={"flex flex-col gap-2"}>
            <label htmlFor={"request_type"}>Request Type</label>
            <h2>{props.request_type}</h2>

            <label htmlFor={"date_submitted"}>Date Submitted</label>
            <h2>{props.date_submitted}</h2>

            <label htmlFor={"amount"}>Amount</label>
            <input
                type={"number"}
                id={"amount"}
                value={props.amount}
                onChange={(e) => props.setAmount(Number(e.target.value))}
                className={"border border-gray-300 rounded-md p-2"}
            />



            <label htmlFor={"assigned_to"}>Assign To</label>
            <select
                id={"type"}
                value={props.assigned_to}
                onChange={(e) => props.setAssignedTo(e.target.value)}
                className={"border border-gray-300 rounded-md p-2"}
                defaultValue={""}
            >
                <option value={""} disabled>Select Type</option>
                
            </select>
           
            <label htmlFor={"description"}>Description</label>
            <input
                type={"text"}
                id={"description"}
                value={props.description}
                onChange={(e) => props.setDescription(e.target.value)}
                className={"border border-gray-300 rounded-md p-2"}
            />

            


        </div>
    );
}

export default RequestForm;
