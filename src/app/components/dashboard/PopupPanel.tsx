import React from 'react';
import {CondoUnitType} from "@/app/constants/types";
import {XMarkIcon} from "@heroicons/react/24/outline";

interface PopupPanelProps {
    content?: React.ReactNode;
    title: string;
    buttonTitle?: string;
    onClick?: () => void;
    visible: boolean;
    setVisible: (value: boolean) => void;
}
function PopupPanel(props: PopupPanelProps) {

    const {title, buttonTitle, onClick, content, visible, setVisible} = props;

    return (
        <>
            {visible && <div className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-40"}></div>}
            {visible &&
                    <div className={`z-40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-fit max-w-[90%] h-fit bg-white shadow-sm rounded-md`}>
                        <div className={`flex flex-row justify-between w-full pt-6 px-6 text-slate-600 font-bold text-lg`}>
                            <div>{title}</div>
                            <XMarkIcon onClick={() => setVisible(false)} className={"w-6 h-6 cursor-pointer"}/>
                        </div>
                        <div className={"px-6 mt-3"}>{content || <div/>}</div>
                        <div className={"bg-slate-100 rounded-b-md mt-7 px-6 py-4"}>
                            <button
                                className={`${buttonTitle ? '' : 'invisible'} px-4 py-4 h-7 bg-indigo-500 rounded-lg hover:bg-indigo-600 text-md justify-center items-center gap-2.5 inline-flex`}
                                onClick={onClick || (() => {
                                })}
                            >
                                <span className="font-semibold text-white">{buttonTitle}</span>
                            </button>
                        </div>
                    </div>
            }
        </>
    );
}

export default PopupPanel;