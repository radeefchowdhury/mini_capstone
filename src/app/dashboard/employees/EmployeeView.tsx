import React from 'react';
import {EmployeeRole, EmployeeType} from "@/app/constants/types";

interface EmployeeViewProps {
    employee: EmployeeType;
    setEmployee: (employee: EmployeeType) => void;
    formAction: 'EDIT' | 'CREATE'
}
function EmployeeView(props: EmployeeViewProps) {
    const {employee, setEmployee, formAction} = props;
    return (
        <div className={"flex flex-col gap-[12px]"}>
            <div className="flex flex-col gap-1">
                <label htmlFor="First Name" className="">First Name</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={employee.first_name || ""}
                    onChange={(e) => setEmployee({...employee, first_name: e.target.value})}
                    type="text" id="name"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="Last Name" className="">Last Name</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={employee.last_name || ""}
                    onChange={(e) => setEmployee({...employee, last_name: e.target.value})}
                    type="text" id="name"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="Email" className="">Email</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={employee.email || ""}
                    onChange={(e) => setEmployee({...employee, email: e.target.value})}
                    type="email" id="email"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            {formAction === 'CREATE' &&
            <div className="flex flex-col gap-1">
                <label htmlFor="Password" className="">Password</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={employee.password || ""}
                    onChange={(e) => setEmployee({...employee, password: e.target.value})}
                    type="password" id="password"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>}
            <div className="flex flex-col gap-1">
                <label htmlFor="Role" className="">Role</label>
                <select
                    value={employee.role || ""}
                    onChange={(e) => setEmployee({...employee, role: e.target.value as EmployeeRole})}
                    id="role"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md">
                    <option value={""} disabled>Select Role</option>
                    {Object.keys(EmployeeRole).map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default EmployeeView;