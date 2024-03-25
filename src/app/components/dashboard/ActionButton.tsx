"use client"
import React from 'react';

interface ActionButtonProps {
    title: string;
    onClick: () => void;
}
function ActionButton(props: ActionButtonProps) {
    return (
        <button
            onClick={props.onClick}
            className={"flex items-center justify-center py-1 px-3 mx-auto bg-blue-500 hover:bg-blue-700 text-white text-sm rounded-md"}
        >
            {props.title}
        </button>
    );
}

export default ActionButton;