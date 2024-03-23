import React, {useEffect} from 'react';
import {CondoFileType} from "@/app/constants/types";
import {
    createCondoFileInstance,
    getCondoFileURL,
    getCondoIDFromName,
    getFilesFromProperty,
    uploadCondoFile
} from "@/app/api/property/PropertyAPI";
import PopupPanel from "@/app/components/dashboard/PopupPanel";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {ArrowDownTrayIcon, ArrowLeftIcon, PencilSquareIcon} from "@heroicons/react/24/outline";

interface PropertyFilesViewProps {
    viewFiles: boolean;
    setViewFiles: (value: boolean) => void;
    propertyId: number;
}
function PropertyFilesView(props: PropertyFilesViewProps) {
    const {viewFiles, setViewFiles, propertyId} = props;
    const [files, setFiles] = React.useState<CondoFileType[]>([]);
    const [formAction, setFormAction] = React.useState<'UPLOAD' | 'VIEW' | 'EDIT'>('VIEW');
    const [selectedFile, setSelectedFile] = React.useState<CondoFileType>();
    const [filteredFiles, setFilteredFiles] = React.useState<any[]>([]);
    const [newFileInfo, setNewFileInfo] = React.useState<CondoFileType>({} as CondoFileType)
    const [file, setFile] = React.useState<File|null>(null);


    const selectFile = (file: CondoFileType) => {
        setSelectedFile(file)
        setFormAction('EDIT')
    }

    const handleFileChange = (e: any) => {
        const targetFile = e.target.files[0]
        setFile(targetFile)
    }

    const uploadNewFile = () => {
        if(!file) return
        let unit_id = -1;
        let file_src = "";
        uploadCondoFile(file, newFileInfo.name).catch(console.error).then(() => {
            getCondoFileURL(newFileInfo.name).catch(console.error).then((data) => {
                if(data) file_src = data
            }).then(() => {
                getCondoIDFromName(newFileInfo.unit.name).catch(console.error).then(res => {
                    if(res && res.data) unit_id = res.data[0].id
                }).then(() => {
                    if(unit_id === -1) return
                    if(file_src === "") return
                    createCondoFileInstance({
                        name: newFileInfo.name,
                        type: newFileInfo.type,
                        src: file_src,
                        unit_id: unit_id
                    }).then(()=> {
                        window.location.reload()
                    })
                })
            })
        }).catch(console.error)

    }

    const downloadFile = (fileSrc: string) => {
        console.log(fileSrc)
        // window.open(fileSrc)
    }

    useEffect(() => {
        if (propertyId === -1) return;
        const fetchData = async () => {
            const {data, error} = await getFilesFromProperty(propertyId);
            if(error){
                console.log(error)
                return
            }
            if(data) setFiles(data)
            console.log(data)
        }
        fetchData().catch(console.error)
    }, [propertyId]);

    useEffect(() => {
        if(files.length == 0) return;
        let filteredData = files.map((condoFile) => {
            return {
                id: condoFile.id,
                name: condoFile.name,
                type: condoFile.type,
                condo_name: condoFile.unit.name,
                src: condoFile.src,
                edit:   <div className={"flex gap-1 flex-row"}>
                            <ActionIcon Icon={PencilSquareIcon} onClick={() => selectFile(condoFile)}/>
                            <ActionIcon Icon={ArrowDownTrayIcon} onClick={() => downloadFile(condoFile.src)}/>
                        </div>
            }
        })
        setFilteredFiles(filteredData)
    }, [files]);

    return (
        <>
            {formAction === "VIEW" &&
                <PopupPanel
                title={'Property Files'}
                buttonTitle={"Upload new File"}
                children={
                    <div>
                        <DashboardTable
                        headers={[
                            {name: 'File Name', key: 'name'},
                            {name: 'File Type', key: 'type'},
                            {name: 'Condo Name', key: 'condo_name'},
                            {name: 'Actions', key: 'edit'},
                        ]}
                        items={filteredFiles}/>
                    </div>
                }
                onClick={() => setFormAction('UPLOAD')}
                visible={viewFiles}
                setVisible={setViewFiles}/>
            }
            {formAction === "UPLOAD" &&
                <PopupPanel
                    title={'Property Files'}
                    buttonTitle={"Upload Now"}
                    children={
                        <>
                            <ArrowLeftIcon
                                className={"mt-3 mb-6 w-6 h-6 text-slate-700 cursor-pointer"}
                                onClick={() => setFormAction('VIEW')}
                            />
                            <div className={"text-slate-500 font-medium flex flex-col gap-3"}>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="File Name" className="">File Name</label>
                                    <input
                                        value={newFileInfo.name || ""}
                                        onChange={(e) => setNewFileInfo({...newFileInfo, name: e.target.value})}
                                        type="text" id="name" name="name"
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="File Type" className="">File Type</label>
                                    <input
                                        value={newFileInfo.type || ""}
                                        onChange={(e) => setNewFileInfo({...newFileInfo, type: e.target.value})}
                                        type="text" id="type" name="type"
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="Condo name" className="">Condo Name</label>
                                    <input
                                        pattern={"[A-Za-z]*"}
                                        value={newFileInfo.unit?.name || ""}
                                        onChange={(e) => setNewFileInfo({...newFileInfo, unit: {id: 0, name: e.target.value}})}
                                        type="text" id="type" name="type"
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="Property Address" className="">File Upload</label>
                                    <input
                                        className={`mb-3 relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-sm font-normal text-neutral-700 transition duration-200 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none `}
                                        onChange={handleFileChange}
                                        type="file" data-testid="profile-picture-upload" id={"profile_picture"}
                                        name={"profile_picture"}
                                    />
                                </div>

                            </div>
                        </>
                    }
                    visible={viewFiles}
                    onClick={uploadNewFile}
                    setVisible={setViewFiles}/>
            }
            {formAction === "EDIT" &&
                <PopupPanel
                    title={'Edit File'}
                    buttonTitle={"Save"}
                    children={
                        <>
                            <ArrowLeftIcon
                                className={"mt-3 mb-6 w-6 h-6 text-slate-700 cursor-pointer"}
                                onClick={() => setFormAction('VIEW')}
                            />
                            Edit File
                        </>
                    }
                    visible={viewFiles}
                    setVisible={setViewFiles}/>
            }
        </>
    );
}

export default PropertyFilesView;