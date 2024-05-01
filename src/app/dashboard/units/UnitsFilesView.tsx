import React, {useEffect} from 'react';
import PopupPanel from "@/app/components/dashboard/PopupPanel";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import {getCondoFilesFromCondoId} from "@/app/api/property/CondoFileAPI";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {ArrowUpRightIcon} from "@heroicons/react/24/outline";
import {CondoFileType, CondoUnitType} from "@/app/constants/types";

interface UnitsFilesViewProps {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    condo: CondoUnitType;
}

function UnitsFilesView(props: UnitsFilesViewProps) {
    const {isVisible, setIsVisible, condo} = props;
    const [files, setFiles] = React.useState<any[]>([]);
    const [filteredFiles, setFilteredFiles] = React.useState<any[]>([]);

    const fetchFiles = async () => {
        if(!condo.id) return
        const {data, error} = await getCondoFilesFromCondoId(condo.id);
        if(error){
            console.log(error)
            return
        }
        if(data) setFiles(data)
    }

    const openFile = (file: CondoFileType) => {
        window.open(file.src)
    }

    useEffect(() => {
        if(!isVisible) setFiles([])
        else fetchFiles().catch(console.error)
    }, [isVisible]);

    useEffect(() => {
        if(files.length == 0){
            setFilteredFiles([])
            return
        }
        let filteredData = files.map((condoFile) => {
            return {
                id: condoFile.id,
                name: condoFile.name,
                type: condoFile.type,
                condo_name: condoFile.unit?.name,
                src: condoFile.src,
                view: <ActionIcon Icon={ArrowUpRightIcon} onClick={() => openFile(condoFile)}/>
            }
        })
        setFilteredFiles(filteredData)
    }, [files])

    useEffect(() => {
        fetchFiles().catch(console.error);
    }, [condo])

    return (
        <>
            {isVisible && (
                <PopupPanel
                    title={"Condo Files: " + condo.name}
                    visible={isVisible}
                    content={
                    <div>
                        <DashboardTable
                            headers={[
                                {name: 'File Name', key: 'name'},
                                {name: 'File Type', key: 'type'},
                                {name: 'Condo Name', key: 'condo_name'},
                                {name: 'Actions', key: 'view'},
                            ]}
                            items={filteredFiles}/>
                        {files.length === 0 &&
                            <div className={"text-center text-gray-500 mt-4"}>
                                No files found
                            </div>
                        }
                    </div>
                    }
                    setVisible={setIsVisible}
                />)
            }
        </>
    );
}

export default UnitsFilesView;