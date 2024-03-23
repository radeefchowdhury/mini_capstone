"use client";

// Import necessary components and hooks
import { useEffect, useState } from "react";
import SideNav from "@/app/components/navbars/SideNav";
import MobileHeader from "@/app/components/navbars/MobileHeader";
import {UserType} from "@/app/constants/types";

// Define the RootLayout component
export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    // State to track whether the sidebar is open or closed
    const [userType, setUserType] = useState<UserType>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [marginExpanded, setMarginExpanded] = useState(true);

    // State to track if the viewport is in mobile mode
    const [isMobile, setIsMobile] = useState(false);

    // Effect to handle resizing and update isMobile state accordingly
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);

        // Initial resize check and event listener setup
        handleResize();
        window.addEventListener("resize", handleResize);

        // Cleanup: remove event listener on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if(!isMobile) {
            setMarginExpanded(!marginExpanded)
        }
    }, [sidebarOpen]);

    useEffect(() => {
        setUserType(localStorage.getItem('user_role') as unknown as UserType);
        setMarginExpanded(true)
    }, []);

    return (
        <>
            <div className={`flex min-h-screen h-full bg-gray-200`}>
                <div>
                    {/* Render the Sidenav component */}
                    <SideNav
                        userType={userType}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                </div>
                <div className="relative flex flex-col flex-1 overflow-x-hidden">
                    {/* Render the Header component if in mobile mode */}
                    {isMobile && (
                        <MobileHeader
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                            className="sticky top-0 bg-white border-b border-slate-200 z-30"
                        />
                    )}
                    {/* Render the main content */}
                    <main className={`${marginExpanded ? 'sm:ml-[255px]' : 'sm:ml-[79px]'} p-8 mt-2 sm:mt-8`}>{children}</main>
                </div>
            </div>
        </>
    );
}