import React from 'react';
import {CondoUnitType, UserType} from "@/app/constants/types";

interface FinanceUnitInfoProps {
    userType: UserType;
    unit: CondoUnitType;
    setUnit: (unit: CondoUnitType) => void;
}
function FinanceUnitInfo(props: FinanceUnitInfoProps) {
    const {unit, setUnit, userType} = props;

    return (
        <div>
            {userType === UserType.COMPANY && <div className={"px-2 text-slate-500 font-medium flex flex-col gap-3"}>
                <div className="-mt-1 flex flex-col gap-1">
                    <label htmlFor="Condo Fee" className="">Condo Fee</label>
                    <input
                        value={unit.fee || ""}
                        onChange={(e) => setUnit({...unit, fee: parseFloat(e.target.value)})}
                        type="number" id="fee"
                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                </div>
                <hr className="mt-3 -mx-1 py-3 border-slate-300 border-t"/>
            </div>}
            <span className={"text-slate-600 font-bold text-lg"}>Total Condo Cost Calculation</span>
            <div className={"mt-2 px-2 text-slate-600 font-medium flex flex-col gap-3"}>
                <div className="flex flex-col gap-3">
                    <div>
                        <label htmlFor="Condo Fee" className="">Condo Cost</label>
                        <div className={"flex flex-row justify-between font-normal text-neutral-500"}>
                            <span>{unit.fee}$/m² x {unit.size}m²</span>
                            <span className={"font-medium text-slate-600"}>= {unit.fee * unit.size}$</span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="Parking Fee" className="">Parking Cost</label>
                        <div className={"flex flex-col justify-between font-normal text-neutral-500"}>
                            {unit.parking_spots.length !== 0 ?
                                unit.parking_spots.map((spot, index) => (
                                    <div className={"flex flex-row justify-between"} key={index}>
                                        <span>{spot.fee}$ {unit.parking_spots.length - 1  !== index ? '+' : ''}</span>
                                        {unit.parking_spots.length - 1  === index &&
                                            <span className={"font-medium text-slate-600"}>= {spot.fee}$</span>}
                                    </div>

                                )) :
                                <div className={"flex flex-row justify-between"}>
                                    <span>0$</span>
                                    <span className={"font-medium text-slate-600"}>= 0$</span>
                                </div>
                            }
                        </div>
                    </div>
                    <div>
                        <label htmlFor="Locker Fee" className="">Locker Cost</label>
                        <div className={"flex flex-col justify-between font-normal text-neutral-500"}>
                            {unit.lockers.length !== 0 ?
                                unit.lockers.map((locker, index) => (
                                    <div className={"flex flex-row justify-between"} key={index}>
                                        <span>{locker.fee}$ {unit.lockers.length - 1  !== index ? '+' : ''}</span>
                                        {unit.lockers.length - 1  === index &&
                                            <span className={"font-medium text-slate-600"}>= {locker.fee}$</span>}
                                    </div>

                                )) :
                                <div className={"flex flex-row justify-between"}>
                                    <span>0$</span>
                                    <span className={"font-medium text-slate-600"}>= 0$</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default FinanceUnitInfo;