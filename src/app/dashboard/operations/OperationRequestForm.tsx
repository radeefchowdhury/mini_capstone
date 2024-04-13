import React, {useEffect} from 'react';
import {EmployeeType, RequestType, RequestTypeOptions, RequestTypeToRole} from "@/app/constants/types";
import {getEmployeesFromCompany} from "@/app/api/request/RequestAPI";

interface RequestFormProps {
    company_id: string;
    request: RequestType;
    setRequest: (request: RequestType) => void;
}

function OperationRequestForm(props: RequestFormProps) {
    const {request, setRequest, company_id} = props;
    const [employees, setEmployees] = React.useState<EmployeeType[]>([]);

    useEffect(() => {
        // Fetch employees
        if(!company_id || !request.type) return;
        getEmployeesFromCompany(company_id).then(({data, error}) => {
            if(error){
                console.log(error)
                return
            }
            const requiredRole = RequestTypeToRole[request.type as keyof typeof RequestTypeToRole];
            let filteredEmployees = data?.filter((employee: EmployeeType) => employee.role === requiredRole) || [];
            setEmployees(filteredEmployees);
        })
        console.log(employees)
    }, [request, company_id]);

    return (
        <div className={"flex flex-col gap-2"}>
            <label htmlFor={"request_type"}>Request Type</label>
            <input
                type={"number"}
                id={"type"}
                value={request.type}
                placeholder={request.type}
                disabled
                className={"border border-gray-300 rounded-md p-2"}
            />
            <label htmlFor={"date_submitted"}>Date Submitted</label>
            <input
                type={"number"}
                id={"date_submitted"}
                value={request.date}
                placeholder={request.date}
                disabled
                className={"border border-gray-300 rounded-md p-2"}
            />
            <label htmlFor={"description"}>Description</label>
            <textarea
                className={"border border-gray-300 rounded-md p-2 text-gray-400"}
                id={"description"}
                value={request.description}
                disabled
                onChange={(e) => setRequest({...request, description: e.target.value})}
            />
            <label htmlFor={"amount"}>Cost ($)</label>
            <input
                type={"number"}
                id={"amount"}
                value={request.amount || 0}
                onChange={(e) => setRequest({...request, amount: parseFloat(e.target.value)})}
                placeholder={request.amount?.toString()}
                className={"border border-gray-300 rounded-md p-2"}
            />
            <label htmlFor={"assigned_to"}>Assign To</label>
            <select
                id={"type"}
                value={request.assigned_to || ""}
                onChange={(e) => setRequest({...request, assigned_to: e.target.value})}
                className={"border border-gray-300 rounded-md p-2"}
            >
            <option value={""} disabled>Select Employee</option>
                {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
            </select>

        </div>
    );
}

export default OperationRequestForm;
