import React from 'react';

interface DashboardPanelProps {
    title: string;
    closable?: boolean;

    onClick: () => void
    buttonTitle?: string
}

function DashboardPanel(props: DashboardPanelProps) {

    const {title, closable, onClick, buttonTitle} = props;

    return (
        <div className={`w-full h-full p-6 bg-white shadow-sm rounded-md`}>
            <div className={`w-full text-slate-600 font-bold text-lg`}>
                {title}
            </div>

            <div className={"bg-slate-100 -mx-6 -mb-6 mt-6 rounded-b-md"}>
                <div className={"px-6 py-4"}>
                    <button
                        className="px-4 py-4 h-7 bg-indigo-500 rounded-lg hover:bg-indigo-600 text-md justify-center items-center gap-2.5 inline-flex">
                        <span className="font-semibold text-white">{buttonTitle}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardPanel;