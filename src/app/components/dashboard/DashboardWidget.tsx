import React from 'react';

interface DashboardWidgetProps {
    icon: any;
    icon_color: string;
    title: string;
    value: string;
}
function DashboardWidget(props: DashboardWidgetProps) {

    return (
        <div className="w-full h-24 bg-white min-w-0 shadow-sm rounded-md flex items-center px-6 overflow-hidden">
            <div className={`min-w-12 min-h-12 rounded-full ${props.icon_color} flex items-center justify-center`}>
                <props.icon className="w-8 h-8 text-white"/>
            </div>
            <div className="flex flex-col ml-4 flex-1 min-w-0">
        <span className="truncate text-slate-600 font-bold text-lg">
            {props.title}
        </span>
                <span className="truncate text-slate-500 text-md">
            {props.value}
        </span>
            </div>
        </div>
    );
}

export default DashboardWidget;