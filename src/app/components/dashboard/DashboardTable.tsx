import React from 'react';
import {HeaderType} from "@/app/constants/types";

interface DashboardTableProps {
    headers: HeaderType[];
    items: any[];
}
function DashboardTable(props: DashboardTableProps) {
    const {headers, items} = props;

    return (
        <div className={"overflow-x-auto rounded-lg outline-gray-200 outline outline-[1px]"}>
            <table className={"min-w-0"}>
                <thead className={"min-w-0"}>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header.name}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        // make odd rows a different color
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                            {headers.map((header, index) => (
                                <td className={"px-4"} key={index}>{item[header.key] || ""}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DashboardTable;