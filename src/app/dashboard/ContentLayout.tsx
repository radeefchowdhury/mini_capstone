"use client"
import React, {ReactNode, useEffect} from 'react';

interface ContentLayoutProps {
    children: ReactNode;
}

function ContentLayout(props: ContentLayoutProps) {
    // Initializes string variable depending on the current url (first letter in uppercase) using window.location.href
    const [header, setHeader] = React.useState<string>("")

    useEffect(() => {
        const url = window.location.href;
        const urlSplit = url.split("/");
        const page = urlSplit[urlSplit.length - 1];
        const pageCapitalized = page.charAt(0).toUpperCase() + page.slice(1);
        setHeader(pageCapitalized + " Orders Dashboard")
    },[setHeader])



    return (
        <div className="flex flex-col min-h-[920px] w-full bg-white rounded-[20px] border border-gray-100 shadow-xl divide-y-2 divide-gray-200">
            <section className="p-8 font-semibold text-xl bg-[#f6f7f9] rounded-t-2xl">{header}</section>
            <div className={"p-8"} >
                {props.children}
            </div>
        </div>
    );
}

export default ContentLayout;