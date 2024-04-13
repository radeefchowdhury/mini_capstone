"use client"
import React from 'react';

interface ActionButtonProps {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
}
function ActionButton(props: ActionButtonProps) {
    return (
        <button
            onClick={props.onClick}
            className={"flex items-center justify-center py-1 px-3 mx-auto bg-blue-500 hover:bg-blue-700 text-white text-sm rounded-md" +
                " focus:outline-none focus:ring-offset-1 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" +
                " disabled:cursor- disabled:bg-gray-200 disabled:text-stone-600 disabled:hover:bg-gray-200 disabled:hover:text-stone-600"}
            disabled={props.disabled}
            title={props.tooltip}
        >
            {props.text}
        </button>
    );
}

export default ActionButton;