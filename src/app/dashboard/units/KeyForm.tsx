import React from 'react';

interface KeyFormProps {
    registration_key: string;
    setKey: (key: string) => void;
}
function KeyForm(props: KeyFormProps) {

    return (
        <div className={"flex flex-col gap-2"}>
            <label htmlFor={"key"}>Key</label>
            <input
                type={"text"}
                id={"key"}
                value={props.registration_key}
                onChange={(e) => props.setKey(e.target.value)}
                className={"border border-gray-300 rounded-md p-2"}
            />
        </div>
    );
}

export default KeyForm;