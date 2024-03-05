import React, {useEffect} from 'react';
import {getCondoList} from "@/app/api/condo/CondoAPI";
import {CondoUnitType} from "@/app/constants/types";

interface CondoTableProps {
    userType?: 'RENTER' | 'OWNER' | 'COMPANY';
    userId?: string;
}

function CondoTable(props: CondoTableProps) {
    const {userType, userId} = props;
    const [condoData, setCondoData] = React.useState<CondoUnitType[]>([]);

    const fetchCondoData = async () => {
        const {data, error} = await getCondoList(userId);
        if(error){
            console.error(error)
            return
        }
        if(data) setCondoData(data)
    }

    useEffect(() => {
        if(userId && userType) fetchCondoData().catch(console.error);
    }, [userId]);

    return (
          <div></div>
    );
}

export default CondoTable;