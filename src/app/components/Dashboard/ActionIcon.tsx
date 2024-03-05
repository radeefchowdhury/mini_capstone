import React from 'react';

interface ActionIconProps {
    Icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
    onClick: () => void;
}
function ActionIcon(props: ActionIconProps) {
    const {Icon, onClick} = props;
    return (
        <Icon
            onClick={props.onClick}
            className={"flex items-center justify-center py-1 px-3 mx-auto bg-blue-500 text-white text-sm rounded-md"}
        />
    );
}

export default ActionIcon;