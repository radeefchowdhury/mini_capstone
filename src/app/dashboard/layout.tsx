import { ReactNode } from 'react';
import SideBar from "@/app/dashboard/SideBar";
import Navbar from "@/app/components/Navbar/Navbar";
import ContentLayout from "@/app/dashboard/ContentLayout";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {



    return (
        <>
            <Navbar />
            <div className="bg-white flex flex-row px-[89px] pt-[30px] gap-10 pb-10">
                <SideBar />
                <ContentLayout children={children} />
            </div>
        </>
    )
}

export default DashboardLayout;