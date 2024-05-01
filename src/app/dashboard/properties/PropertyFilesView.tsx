import React, {useEffect} from 'react';
import {CondoFileType, CondoUnitType, PropertyType} from "@/app/constants/types";
import {
    getCondoIDFromName, getCondosFromProperty,
} from "@/app/api/property/PropertyAPI";
import PopupPanel from "@/app/components/dashboard/PopupPanel";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {ArrowLeftIcon, ArrowUpRightIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import {
    deleteCondoFile,
    getCondoFileURL,
    getFilesFromProperty,
    submitCondoFile,
    uploadCondoFile
} from "@/app/api/property/CondoFileAPI";

interface PropertyFilesViewProps {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    property: PropertyType;
}
function PropertyFilesView(props: PropertyFilesViewProps) {
    const {isVisible, setIsVisible, property} = props;
    const [files, setFiles] = React.useState<CondoFileType[]>([]);
    const [formAction, setFormAction] = React.useState<'UPLOAD' | 'VIEW' | 'EDIT'>('VIEW');
    const [selectedFile, setSelectedFile] = React.useState<CondoFileType>();
    const [filteredFiles, setFilteredFiles] = React.useState<any[]>([]);
    const [newFileInfo, setNewFileInfo] = React.useState<CondoFileType>({} as CondoFileType)
    const [file, setFile] = React.useState<File|null>(null);
    const [filesToDelete, setFilesToDelete] = React.useState<number[]>([]);
    const [condos, setCondos] = React.useState<CondoUnitType[]>([])

    const selectFile = (file: CondoFileType) => {
        setSelectedFile(file)
        setFormAction('EDIT')
        setFile(null)
        setFilesToDelete([])
    }

    const handleFileChange = (e: any) => {
        const targetFile = e.target.files[0]
        setFile(targetFile)
    }

    const uploadNewFile = () => {
        if(!file) return
        let file_src = "";
        uploadCondoFile(file, newFileInfo.name).catch(console.error).then(() => {
            getCondoFileURL(newFileInfo.name).catch(console.error).then((data) => {
                if(data) file_src = data
            }).then(() => {
                upsertCondoFile(newFileInfo, file_src).then(r => console.log(r))
            })
        }).catch(console.error)
    }

    const toggleFileToDelete = (id: number) => {
        setFilesToDelete(prevFilesToDelete => {
            if (prevFilesToDelete.includes(id)) {
                // If the file is already selected, remove it from the list
                return prevFilesToDelete.filter(file_id => file_id !== id);
            } else {
                // If the file is not already selected, add it to the list
                return [...prevFilesToDelete, id];
            }
        });
    }

    const deleteSelectedCondoFile = (id: number) => {
        deleteCondoFile(id).catch(console.error).then(() => {
            window.location.reload()
        })
    }

    const downloadFile = (fileSrc: string) => {
        window.open(fileSrc)
    }

    const saveFileOnClick = async () => {
        if(!selectedFile) return
        let file_src = "";
        if(file){
            uploadCondoFile(file, selectedFile.name).catch(console.error).then(() => {
                getCondoFileURL(selectedFile.name).catch(console.error).then((data) => {
                    if(data) file_src = data
                }).then(() => {
                    upsertCondoFile(selectedFile, file_src)
                })
            }).catch(console.error)
        }
        else await upsertCondoFile(selectedFile, selectedFile.src)

    }

    const upsertCondoFile = async (file_to_upsert: CondoFileType, fileSrc: string) => {
        let unit_id = -1;
        let file_src = fileSrc;
        await getCondoIDFromName(file_to_upsert.unit.name).catch(console.error).then(res => {
            if(res && res.data) unit_id = res.data[0].id
        }).then(() => {
            if(unit_id === -1 || fileSrc === "") return
            submitCondoFile({
                id: file_to_upsert.id,
                name: file_to_upsert.name,
                type: file_to_upsert.type,
                src: file_src,
                unit_id: unit_id
            }).then(()=> {
                window.location.reload()
            })
        })
    }

    const fetchData = async () => {
        if (!property.id) return;
        const {data, error} = await getFilesFromProperty(property.id);
        if(error){
            console.log(error)
            return
        }
        if(data) setFiles(data)
        const {data: condoData, error: condoError} = await getCondosFromProperty(property.id);
        if(condoData) setCondos(condoData)
    }

    useEffect(() => {
        if(!isVisible){
            setFiles([])
            setFilesToDelete([])
            setSelectedFile(undefined)
            setFile(null)
            setNewFileInfo({} as CondoFileType)
        }
        else fetchData().catch(console.error)
        if(!isVisible) setFormAction('VIEW')
    }, [isVisible]);

    useEffect(() => {
        fetchData().catch(console.error)
    }, [property]);

    useEffect(() => {
        if(files.length == 0){
            setFilteredFiles([])
            return
        }
        let filteredData = files.map((condoFile) => {
            return {
                id: condoFile.id,
                name:
                    <div className={"flex flex-row gap-4 px-2"}><input type="checkbox" onChange={() => toggleFileToDelete(condoFile.id)}/>
                    {condoFile.name}
                    </div>,
                type: condoFile.type,
                condo_name: condoFile.unit?.name,
                src: condoFile.src,
                edit:   <div className={"flex gap-1 flex-row"}>
                            <ActionIcon Icon={PencilSquareIcon} onClick={() => selectFile(condoFile)}/>
                            <ActionIcon Icon={ArrowUpRightIcon} onClick={() => downloadFile(condoFile.src)}/>
                        </div>
            }
        })
        setFilteredFiles(filteredData)
    }, [files]);

    useEffect(() => {
        console.log(selectedFile)
    }, [selectedFile]);

    useEffect(() => {
        console.log(newFileInfo)
    }, [newFileInfo]);

    useEffect(() => {
        if (condos.length > 0 && (!newFileInfo.unit || !newFileInfo.unit.name)) {
            setNewFileInfo(prevState => ({
                ...prevState,
                unit: {
                    ...prevState.unit,
                    name: condos[0].name,
                    id: 0
                }
            }));
        }
    }, [condos]);

    return (
        <>
            {formAction === "VIEW" &&
                <PopupPanel
                title={'Property Files: ' + property.name || ' '}
                buttonTitle={"Upload new File"}
                children={
                    <div>
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
                        <button
                            // style it so that it is a light indigo when there are no files to delete selected
                            // and a normal indigo when there are files to delete selected
                            className={`w-fit px-2 py-1 mt-4 rounded-md ${filesToDelete.length === 0 ? "bg-indigo-200 cursor-default" : "bg-indigo-500 hover:bg-indigo-700"} text-white`}
                            disabled={filesToDelete.length === 0}
                            onClick={() => {
                            filesToDelete.forEach((file_id) => {
                                deleteSelectedCondoFile(file_id)
                            })
                        }}>Delete Selected Files
                        </button>
                    </div>
                }
                onClick={() => setFormAction('UPLOAD')}
                visible={isVisible}
                setVisible={setIsVisible}/>
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
                                    <label htmlFor="Condo Name" className="">Condo Name</label>
                                    <select
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"
                                        value={newFileInfo.unit?.name || (condos[0]?.name || "")}
                                        onChange={(e) => setNewFileInfo({...newFileInfo, unit: {
                                                name: e.target.value,
                                                id: 0
                                            }})}
                                    >
                                        {condos.map((condo) => (
                                            <option key={condo.id} value={condo.name}>{condo.name}</option>
                                        ))}
                                    </select>
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
                    visible={isVisible}
                    onClick={uploadNewFile}
                    setVisible={setIsVisible}/>
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
                            {selectedFile &&
                                <div className={"text-slate-500 font-medium flex flex-col gap-3"}>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="File Name" className="">File Name</label>
                                        <input
                                            value={selectedFile.name || ""}
                                            onChange={(e) => setSelectedFile({...selectedFile, name: e.target.value})}
                                            type="text" id="name" name="name"
                                            className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="File Type" className="">File Type</label>
                                        <input
                                            value={selectedFile.type || ""}
                                            onChange={(e) => setSelectedFile({...selectedFile, type: e.target.value})}
                                            type="text" id="type" name="type"
                                            className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="Condo Name" className="">Condo Name</label>
                                        <select
                                            className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"
                                            value={selectedFile.unit?.name || ""}
                                            onChange={(e) => setSelectedFile({...selectedFile, unit: {
                                                    name: e.target.value,
                                                    id: 0
                                                }})}
                                        >
                                            {condos.map((condo) => (
                                                <option key={condo.id} value={condo.name}>{condo.name}</option>
                                            ))}
                                        </select>
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
                                </div>}
                        </>
                    }
                    visible={isVisible}
                    onClick={saveFileOnClick}
                    setVisible={setIsVisible}/>
            }
        </>
    );
}

export default PropertyFilesView;