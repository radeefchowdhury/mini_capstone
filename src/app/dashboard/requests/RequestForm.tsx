import React from 'react';

interface RequestFormProps {
    condo_name: string;
    type: string;
    description: string;

    setCondoName: (condo_name: string) => void;
    setType: (type: string) => void;
    setDescription: (description: string) => void;
}

function RequestForm(props: RequestFormProps) {
    const handleSubmit = () => {
    };

    return (
        <div className={"flex flex-col gap-2"}>
            <label htmlFor={"condo_name"}>Condo Name</label>
            <input
                type={"text"}
                id={"condo_name"}
                value={props.condo_name}
                onChange={(e) => props.setCondoName(e.target.value)}
                className={"border border-gray-300 rounded-md p-2"}
            />

            <label htmlFor={"type"}>Type</label>
            <select
                id={"type"}
                value={props.type}
                onChange={(e) => props.setType(e.target.value)}
                className={"border border-gray-300 rounded-md p-2"}
                defaultValue={""}
            >
                <option value={""} disabled>Select Type</option>
                <option value="REPAIR">Repair</option>
                <option value="ADDITION">Addition</option>
                <option value="SUGGESTION">Suggestion</option>
                <option value="EXTERNAL">External</option>
            </select>

            <label htmlFor={"description"}>Description</label>
            <input
                type={"text"}
                id={"description"}
                value={props.description}
                onChange={(e) => props.setDescription(e.target.value)}
                className={"border border-gray-300 rounded-md p-2"}
            />

            


        </div>
    );
}

export default RequestForm;
