import React, {useEffect} from 'react';

interface RequestFormProps {
    condo_name: string;
    type: string;
    description: string;
    condos: string[];
    setCondoName: (condo_name: string) => void;
    setType: (type: string) => void;
    setDescription: (description: string) => void;
}

function RequestForm(props: RequestFormProps) {

    return (
        <div className={"flex flex-col gap-2 min-w-0"}>
            <label htmlFor={"condo_name"}>Condo Name</label>
            <select
                id={"condo_name"}
                value={props.condo_name}
                onChange={(e) => props.setCondoName(e.target.value)}
                className={"border border-gray-300 rounded-md p-2 font-inter bg-white min-w-0"}
            >
                <option value={""} disabled>Select Condo</option>
                {props.condos.map((condo) => (
                    <option key={condo} value={condo}>{condo}</option>
                ))}
            </select>

            <label htmlFor={"type"}>Type</label>
            <select
                id={"type"}
                value={props.type}
                onChange={(e) => props.setType(e.target.value)}
                className={"border border-gray-300 rounded-md p-2 font-inter bg-white min-w-0"}
                required={true}
            >
                <option value={""} disabled>Select Type</option>
                <option value="REPAIR">Repair</option>
                <option value="ADDITION">Addition</option>
                <option value="SUGGESTION">Suggestion</option>
                <option value="EXTERNAL">External</option>
            </select>

            <label htmlFor={"description"}>Description</label>
            <textarea
                id={"description"}
                value={props.description}
                onChange={(e) => props.setDescription(e.target.value)}
                className={"border border-gray-300 rounded-md p-2 min-w-0"}
            />

            


        </div>
    );
}

export default RequestForm;
