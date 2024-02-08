"use client"
import React, {ReactComponentElement, useEffect, useState} from 'react';
import {
    DocumentArrowUpIcon,
    DocumentChartBarIcon,
    DocumentCheckIcon,
    MapPinIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
function SideBar() {

    const iconClassNames = "h-8 text-gray-800";

    const [sideBarItems, setSideBarItems] = useState<SideBarItemProps[]> ([
        {
            name: "New",
            icon: <DocumentArrowUpIcon className={iconClassNames}/>,
            isFocused: false,
        },
        {
            name: "Ongoing",
            icon: <DocumentChartBarIcon className={iconClassNames}/>,
            isFocused: false,
        },
        {
            name: "Completed",
            icon: <DocumentCheckIcon className={iconClassNames}/>,
            isFocused: false,
        },
        {
            name: "Tracking",
            icon: <MapPinIcon className={iconClassNames}/>,
            isFocused: false,
        }
    ])

    // Update which item is focused based on the url
    useEffect(() => {
        const url = window.location.href;
        const urlSplit = url.split("/");
        const page = urlSplit[urlSplit.length - 1];

        // Set all items to not focused
        setSideBarItems(sideBarItems.map((item) => {
            return {...item, isFocused: false}
        }))

        // Set the item that matches the page to focused
        setSideBarItems(sideBarItems.map((item) => {
            if(item.name.toLowerCase() === page){
                return {...item, isFocused: true}
            }
            return item;
        }))
    },[setSideBarItems])


    return (
        <div className="flex flex-col h-auto min-w-[250px] bg-white rounded-[20px] border border-gray-100 shadow-xl">
            <div className="w-full h-[68px] flex items-center bg-primary-1 rounded-t-[20px]">
                <div className="w-full h-full flex justify-center items-center text-white text-2xl font-medium  ">Orders</div>
            </div>
            <div className="flex flex-col gap-2 h-fit w-full mt-10 px-[24px]">
                {sideBarItems.map((item, index) => {
                    if(index < 3){
                        return <SideBarItem key={index} name={item.name} icon={item.icon} isFocused={item.isFocused}/>
                    }
                })}
            </div>
            <div className="border-b-2 border-gray-200 my-8"></div>
            <div className="flex flex-col gap-2 h-fit w-full px-[24px]">
                <div className="text-black text-opacity-50 text-base font-semibold   leading-tight">
                    Live Tracking
                </div>
                {sideBarItems.map((item, index) => {
                    if(index === 3){
                        return <SideBarItem key={index} name={item.name} icon={item.icon} isFocused={item.isFocused}/>
                    }
                })}
            </div>
            <div className="border-b-2 w-full mt-auto border-gray-200 self-end"></div>
            <div className={"flex flex-col h-[150px] w-full self-end p-8"}>
                <UserCircleIcon className={"h-11 text-gray-700 ml-[-3px] mr-auto"}/>
                <div className="mt-2 text-black text-sm font-semibold    leading-none">Pie Crust</div>
                <div className="text-black text-opacity-50 text-xs font-normal   ">hello@piecrust.uk</div>
            </div>
        </div>
    );
}

interface SideBarItemProps {
    name: string;
    icon: ReactComponentElement<any>;
    isFocused: boolean;
}

function SideBarItem(props: SideBarItemProps){
    const {name, icon, isFocused} = props;

    // If the item is focused, change the background color
    const backgroundColor = isFocused ? "bg-gray-200" : "bg-white";

    const itemhref = name.toLowerCase();


    return (
        <a className={`${backgroundColor} w-full h-[40px] flex flex-row items-center rounded-[14px] px-[25px] py-[25px] gap-4 hover:bg-gray-100`}
            href={itemhref}>
            {icon}
            <div className="w-full h-fit flex items-center text-gray-800 font-medium  ">
                {name}
            </div>
        </a>
    );

}

export default SideBar;