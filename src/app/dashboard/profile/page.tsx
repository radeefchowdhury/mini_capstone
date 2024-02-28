"use client"

import React from 'react';
import Image from 'next/image'
import connection from "@/app/supabase/supabase";
import {EyeIcon, PencilIcon} from "@heroicons/react/16/solid";

interface ProfileOptions {
    id?: string;
    first_name?: string;
    last_name?: string;
    contact_email?: string;
    phone_number?: string;
    profile_picture?: string;
    role?: string;
    registration_key?: string;
}
function Page() {

    const supabase = connection;
    const windowClassName = "p-6 bg-white shadow-sm rounded-md";
    const [profileOptions, setProfileOptions] = React.useState<ProfileOptions>({} as ProfileOptions);

    const [keyVisible, setKeyVisible] = React.useState<boolean>(false);
    const [editable, setEditable] = React.useState(false);

    const [profilePictureFile, setProfilePictureFile] = React.useState<File | null>(null);


    const submitProfileOptions = async () => {
        await supabase
            .from('user_profile')
            .upsert([profileOptions])
    }

    const uploadProfilePicture = async () => {
        if(!profilePictureFile) return
        await supabase
            .storage
            .from('profile_picture_bucket')
            .upload(`${profileOptions.id}_avatar.png`, profilePictureFile, {
                cacheControl: '3600',
                upsert: true
            })
            .then(getProfilePictureURL)
            .catch(console.error)
    }

    const getProfilePictureURL = async () => {
        supabase
            .storage
            .from('profile_picture_bucket')
            .createSignedUrl(`${profileOptions.id}_avatar.png`, 60)
            .then(res => {
                setProfileOptions(prevState => ({
                ...prevState,
                profile_picture: res.data?.signedUrl
                }))})
            .then(submitProfileOptions)
            .catch(console.error)
    }

    const handleToggleVisibility = () => {
        setKeyVisible(!keyVisible);
    };

    const handleToggleEdit = () => {
        setEditable(!editable);
    };

    const submitProfilePicture = async (event: any) => {
        event.preventDefault()
        if(!profilePictureFile) {
            console.log('No file selected')
            return
        }
        await uploadProfilePicture()
    }

    const handleProfileChange = async (event: any) => {
        const field = event.target.id;
        console.log('here')
        if (event.target.type === 'file') {
            const file = event.target.files ? event.target.files[0] : null;
            if (!file) return
            let fileURL = URL.createObjectURL(file);
            setProfilePictureFile(file);
            setProfileOptions(prevState => ({
                ...prevState,
                [field]: fileURL
            }))
        } else {
            const value = event.target.value;
            setProfileOptions(prevState => ({
                ...prevState,
                [field]: value
            }))
        }
    }


    React.useEffect(() => {
        const fetchData = async () => {
            const userSession = await supabase.auth.getSession()
            if (!userSession) window.location.href = '/login'
            const {data, error} = await supabase
                .from('user_profile')
                .select('*')

            if (error) {
                console.log('Error fetching user data: ', error)
                // redirect to login page
                window.location.href = '/login'
                return
            } else {
                setProfileOptions(data[0])
            }
        }
        fetchData().catch(console.error)
    }, []);

    function handleSubmit() {
        console.log('submitted');
    }

    return (
        <main className="p-8 mt-10">
            <div className="main-content flex flex-col items-center lg:items-start lg:flex-row gap-6 w-full">
                <div className="w-full flex flex-col gap-6">
                    <div className={`${windowClassName}`}>
                        <div className={`w-full text-slate-600 font-bold text-lg`}>
                            Profile Information
                        </div>
                        <div className="mt-6 mb-10 text-slate-500 font-medium text-[16px] flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row gap-6 [&>*]:w-full">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="first_name" className="">First Name</label>
                                    <input
                                        onChange={handleProfileChange}
                                        type="text" id="first_name" name="first_name"
                                        placeholder={profileOptions.first_name}
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="last_name" className="">Last Name</label>
                                    <input
                                        onChange={handleProfileChange}
                                        placeholder={profileOptions.last_name} type="text" id="last_name" name="last_name"
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="contact_email" className="">Email</label>
                                <input
                                    onChange={handleProfileChange}
                                    type="email" id="contact_email" name="email" placeholder={profileOptions.contact_email}
                                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="phone_number" className="">Phone</label>
                                <input
                                    onChange={handleProfileChange}
                                    type="tel" id="phone_number" name="phone" placeholder={profileOptions.phone_number}
                                    pattern="\d*" className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>
                        </div>
                        <div className={"bg-slate-100 -mx-6 -mb-6 rounded-b-md"}>
                            <div className={"px-6 py-4"}>
                                <button
                                    onClick={submitProfileOptions}
                                    className="px-4 py-4 h-7 bg-indigo-500 rounded-lg hover:bg-indigo-600 text-md justify-center items-center gap-2.5 inline-flex">
                                    <span className="font-semibold text-white">Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`${windowClassName} `}>
                        <div className={`w-full text-slate-700 font-bold text-lg`}>
                            Registration key
                        </div>
                        <div className="relative border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg">Key:</p>
                                    {editable ? (
                                        <form onSubmit={handleSubmit} className="mt-2">
                                            <input
                                                id={"registration_key"}
                                                type="text"
                                                value={profileOptions.registration_key}
                                                onChange={handleProfileChange}
                                                className="border rounded-md px-2 py-1 w-full"
                                            />
                                        </form>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className="mr-2">{keyVisible ? profileOptions.registration_key : '***'}</span>
                                            <button
                                                onClick={handleToggleVisibility}
                                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                <EyeIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button
                                        onClick={handleToggleEdit}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col sm:max-w-fit gap-6">
                    <div className={`${windowClassName} text-slate-600 font-bold text-lg`}>
                        <div className={`text-slate-700 font-bold text-lg`}>
                            How others see you
                        </div>
                        <div className="mt-16 mb-4 flex flex-col items-center gap-1">
                            <div className={"image-container w-[120px] h-[120px]"}>
                                <Image
                                    className={"rounded-full w-full h-full object-cover"}
                                    src={profileOptions.profile_picture || "/default_profile_picture.png"}
                                    alt={"profile picture"}
                                    width={120}
                                    height={120}
                                    style={{objectFit: 'cover'}}
                                    priority={true}
                                />
                            </div>
                            <span className={"mt-5 font-semibold"}>{profileOptions.first_name} {profileOptions.last_name}</span>
                            <span className={"mt-2 font-medium"}>({profileOptions.role})</span>
                            <span className={"text-md font-normal"}>{profileOptions.contact_email}</span>
                            <span className={"text-md font-normal"}>{profileOptions.phone_number}</span>
                            <div className={"mt-3 flex flex-row gap-2"}>
                                {/*Connect button */}
                                <button
                                    className="mt-2 px-3 h-7 bg-slate-700 rounded-lg hover:bg-slate-800 text-sm justify-center items-center gap-2.5 inline-flex">
                                    <span className="font-semibold text-white">Connect</span>
                                </button>
                                {/*Send message button */}
                                <button className="mt-2 px-3 h-7 bg-orange-400 rounded-lg hover:bg-orange-500 text-sm justify-center items-center gap-2.5 inline-flex">
                                    <span className="font-semibold text-slate-900 flex-nowrap">Send Message</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`${windowClassName} text-slate-600 font-bold text-lg`}>
                        <div className="mb-2">
                            <p className="text-gray-700 font-semibold text-lg">
                                Select profile photo
                            </p>
                        </div>
                        <input
                            className={`mt-6 relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-sm font-normal text-neutral-700 transition duration-200 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none `}
                            onChange={handleProfileChange}
                            type="file" id={"profile_picture"} name={"profile_picture"}
                        />
                        <div className={"bg-slate-100 -mx-6 -mb-6 mt-7 rounded-b-md"}>
                            <div className={"px-6 py-4"}>
                                <button
                                    onClick={submitProfilePicture}
                                    className="px-4 py-4 h-7 bg-indigo-500 rounded-lg hover:bg-indigo-600 text-md justify-center items-center gap-2.5 inline-flex">
                                    <span className="font-medium text-white">Upload</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default Page;