import React from 'react';

interface DashboardWindowProps {
    children: React.ReactNode;
    title: string;
}
function DashboardWindow(props: DashboardWindowProps) {
    return (
        <div className="p-7 ">
            <span className="text-gray-800 font-bold text-lg">
                {props.title}
            </span>
            <div>
                {props.children}
            </div>
        </div>
    );
}

export default DashboardWindow;