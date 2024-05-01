"use client"
import React, {useEffect} from 'react';
import {EmployeeType, HeaderType, UserType} from "@/app/constants/types";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import EmployeeView from "@/app/dashboard/employees/EmployeeView";
import {submitUserProfileNoReload} from "@/app/api/userprofile/UserProfileAPI";
import connection from "@/app/api/supabase/SupabaseContextProvider";
import {getEmployeeProfilesFromCompany, insertEmployee} from "@/app/api/employee/EmployeeAPI";


const employeeHeaders: HeaderType[] = [
    {name: 'ID', key: 'id'},
    {name: 'First Name', key: 'first_name'},
    {name: 'Last Name', key: 'last_name'},
    {name: 'Email', key: 'contact_email'},
    {name: 'Request ID', key: 'request_id'},
    {name: 'Role', key: 'role'},
]

function Page() {
    const [userId, setUserId] = React.useState<string>();
    const [employees, setEmployees] = React.useState<EmployeeType[]>([]);
    const [filteredEmployees, setFilteredEmployees] = React.useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeType | undefined>(undefined);
    const [newEmployee, setNewEmployee] = React.useState<EmployeeType>({} as EmployeeType);
    const [formAction, setFormAction] = React.useState<'EDIT' | 'CREATE' | undefined>(undefined);
    const supabase = connection

    const registerNewEmployeeOnClick = () => {
        setSelectedEmployee(newEmployee)
        setFormAction(formAction === 'EDIT' ? 'CREATE' : formAction === 'CREATE' ? undefined : 'CREATE')
    }

    const registerEmployeeOnClick = async (employee: EmployeeType) => {
        // Create user profile for employee
        if(!userId || !employee.password) return

        await supabase.auth.signUp({
            email: employee.email,
            password: employee.password,

        }).then((res) => {
            const user_id = res.data.user?.id
            submitUserProfileNoReload({
                id: user_id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                contact_email: employee.email,
                role: UserType.EMPLOYEE,
            }).then(res => {
                insertEmployee({
                    company_id: userId,
                    role: employee.role,
                    user_id: user_id
                }).then(({data, error}) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    window.location.reload()
                })
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    const fetchEmployees = async () => {
        if (!userId) return;
        getEmployeeProfilesFromCompany(userId).then(({data, error}) => {
            if (error) {
                console.log(error)
                return
            }
            console.log(data)
            setEmployees(data as EmployeeType[])
        })
    }

    useEffect(() => {
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    useEffect(() => {
        if (userId) fetchEmployees().catch(console.error)
    }, [userId]);

    useEffect(() => {
        setFilteredEmployees(employees.map((employee) => {
            return {
                id: employee.id,
                first_name: employee.profile?.first_name,
                last_name: employee.profile?.last_name,
                contact_email: employee.profile?.contact_email,
                request_id: employee.request_id || 'N/A',
                role: employee.role,
            }
        }))
    }, [employees]);

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={"min-w-0 max-w-fit"}>
                <DashboardPanel
                    title={"My Employees"}
                    buttonTitle={'Register New Employee'}
                    onClick={registerNewEmployeeOnClick}
                    content={<DashboardTable headers={employeeHeaders} items={filteredEmployees} />}
                ></DashboardPanel>
            </div>
            <div className={"min-w-[370px]"}>
                {(selectedEmployee && formAction) &&
                <DashboardPanel
                    title={"Employee Details"}
                    content={<EmployeeView
                        employee={selectedEmployee}
                        setEmployee={setSelectedEmployee}
                        formAction={formAction}
                    />}
                    buttonTitle={'Register Employee'}
                    onClick={() => registerEmployeeOnClick(selectedEmployee)}
                />}
            </div>
        </div>
    );
}

export default Page;