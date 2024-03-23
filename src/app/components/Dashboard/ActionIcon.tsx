import React from 'react';

interface ActionIconProps {
    Icon: any;
    onClick: () => void;
}
function ActionIcon(props: ActionIconProps) {
    const {Icon, onClick} = props;
    return (
        <Icon
            onClick={props.onClick}
            className={"flex items-center text-black justify-center mx-auto w-6 rounded-md cursor-pointer"}
        />
    );
}

export default ActionIcon;