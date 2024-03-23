import React from 'react';
import {CondoUnitType} from "@/app/constants/types";

interface CondoUnitInfoProps {
    unit: CondoUnitType;
    setUnit: (unit: CondoUnitType) => void;
}
function CondoUnitInfo(props: CondoUnitInfoProps) {
    const {unit, setUnit} = props;

    return (
        <div className={"text-slate-500 font-medium flex flex-col gap-3"}>
            <div className="flex flex-col gap-1">
                <label htmlFor="Condo Name" className="">Condo Name</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.name || ""}
                    onChange={(e) => setUnit({...unit, name: e.target.value})}
                    type="text" id="name"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="Property Name" className="">Property Name</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.property_name || unit.property.name || ""}
                    onChange={(e) => setUnit({...unit, property_name: e.target.value})}
                    type="text" id="property_name"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Condo Number" className="">Condo Number</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.number || ""}
                    onChange={(e) => setUnit({...unit, number: parseInt(e.target.value)})}
                    type="text" id="number" name="number"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Fee" className="">Fee ($)</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.fee || ""}
                    onChange={(e) => setUnit({...unit, fee: parseFloat(e.target.value)})}
                    type="number" id="fee" name="fee"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Size" className="">Size (m²)</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.size || ""}
                    onChange={(e) => setUnit({...unit, size: parseInt(e.target.value)})}
                    type="number" id="size" name="size"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
        </div>
    );
}

export default CondoUnitInfo;