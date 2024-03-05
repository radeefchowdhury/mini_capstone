import React from 'react';

interface DashboardPanelProps {
    title: string;
    closable?: boolean;
    children?: React.ReactNode;
    onClick: () => void;
    buttonTitle?: string
}

function DashboardPanel(props: DashboardPanelProps) {

    const {title, closable, onClick, buttonTitle, children} = props;

    return (
        <div className={`w-full h-fit bg-white shadow-sm rounded-md`}>
            <div className={`w-full pt-6 px-6 text-slate-600 font-bold text-lg`}>
                {title}
            </div>
            <div className={"px-6"}>
                {children || <div />}
            </div>

            <div className={"bg-slate-100 rounded-b-md mt-5 px-6 py-4"}>
                <button
                    className={`${buttonTitle ? '' : 'invisible'} px-4 py-4 h-7 bg-indigo-500 rounded-lg hover:bg-indigo-600 text-md justify-center items-center gap-2.5 inline-flex`}
                    onClick={onClick || (() => {})}
                >
                    <span className="font-semibold text-white">{buttonTitle}</span>
                </button>
            </div>
        </div>
    );
}

export default DashboardPanel;