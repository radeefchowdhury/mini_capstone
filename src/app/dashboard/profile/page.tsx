"use client"

import React, {useEffect} from 'react';
import connection from "@/app/api/supabase/supabase";
import {EyeIcon, PencilIcon} from "@heroicons/react/16/solid";
import {UserProfileType} from "@/app/constants/types";
import {
    getProfilePictureURL,
    getUserProfile, getUserSession,
    submitUserProfile,
    uploadProfilePicture
} from "@/app/api/userprofile/UserProfileAPI";


function Page() {

    const supabase = connection;
    const windowClassName = "w-full p-6 bg-white shadow-sm rounded-md";
    const [userProfile, setUserProfile] = React.useState<UserProfileType>({} as UserProfileType);

    const [keyVisible, setKeyVisible] = React.useState<boolean>(false);
    const [editable, setEditable] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

    const [profileError, setProfileError] = React.useState<string>('');
    const [fileError, setFileError] = React.useState<string>('');

    const [profilePictureFile, setProfilePictureFile] = React.useState<File | null>(null);

    const handleToggleVisibility = () => {
        setKeyVisible(!keyVisible);
    };

    const handleToggleEdit = () => {
        setEditable(!editable);
    };

    const saveUserProfile = () => {
        if (!checkProfile()) return
        submitUserProfile(userProfile).catch(console.error)
    }

    const updateProfile = (field: keyof UserProfileType, value: string) => {
        setUserProfile(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    const fetchData = async () => {
        const userSession = await getUserSession()
        if (!userSession) window.location.href = '/login'

        const {data, error} = await getUserProfile()
        if (error || !data){
            console.error(error?.message || 'Error fetching user profile')
            return
        }
        if(data[0].profile_picture) data[0].profile_picture += `?${Date.now()}`
        setUserProfile(data[0])
    }

    const submitProfilePicture = async (event: any) => {
        event.preventDefault()
        if(!profilePictureFile) return
        setUploading(true)
        uploadProfilePicture(
            profilePictureFile,
            `${userProfile.id}_avatar.png`
        )
            .then(async () => {
                const imageURL = await getProfilePictureURL(`${userProfile.id}_avatar.png`)
                updateProfile('profile_picture', imageURL)
            })
            .catch(console.error);
    }

    const handleProfileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = event.target.id as keyof UserProfileType;
        const prevValue = userProfile[field as keyof UserProfileType] || '';
        const isValid = event.target.validity.valid;
        const value = event.target.value;

        if (!isValid && value !== '' && field !== 'contact_email') {
            event.target.value = prevValue.toString();
            return
        }
        updateProfile(field, value)
    }

    const checkProfile = () => {
        // Check first name and last name are not empty and is at least 3 characters long
        if (!userProfile.first_name || userProfile.first_name.length < 3) {
            setProfileError('First name must be at least 3 characters long');
            return false
        }
        if (!userProfile.last_name || userProfile.last_name.length < 3) {
            setProfileError('Last name must be at least 3 characters long');
            return false
        }
        // Check email pattern using regex
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!userProfile.contact_email?.match(emailPattern)) {
            setProfileError('Invalid email');
            return false
        }
        // Check phone number pattern using regex
        const phonePattern = /^\d{10}$/;
        if (!userProfile.phone_number?.toString().match(phonePattern)) {
            setProfileError('Invalid phone number, must be 10 digits');
            return false
        }
        return true
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) return
        const fileURL = URL.createObjectURL(file);
        // Check file type is image
        if (!file.type.includes('image')) {
            setFileError('Invalid file type');
            return
        }
        // Check file size <= 2MB
        if (file.size > 2 * 1024 * 1024) {
            setFileError('File size must be less than 2MB');
            return
        }
        setFileError('');
        setProfilePictureFile(file);
        updateProfile('profile_picture', fileURL)
    }


    React.useEffect(() => {
        if(!userProfile.profile_picture == undefined || !userProfile.profile_picture) return
        // If the profile picture is a blob, it means the userProfile has not been submitted yet
        // So we wait for the profile picture to be uploaded before submitting the userProfile
        if(uploading && profilePictureFile && !userProfile.profile_picture?.includes('blob')){
            submitUserProfile(userProfile).catch(console.error)
            setUploading(false)
            return
        }
        // Cache busting
        if(!userProfile.profile_picture?.includes('local') && !userProfile.profile_picture?.includes('?')){
            updateProfile('profile_picture', userProfile.profile_picture + `?${Date.now()}`)
        }
    }, [userProfile.profile_picture])

    // Fetch user profile data
    React.useEffect(() => {
        fetchData().catch(console.error)
    }, []);

    function handleSubmit() {
        console.log('submitted');
    }

    return (
        <main className="p-8 mt-2 sm:mt-8">
            <div className="main-content flex flex-col items-center lg:items-start lg:flex-row gap-6 w-full">
                <div className="w-full flex flex-col gap-6">
                    <div className={`${windowClassName}`}>
                        <div className={`w-full text-slate-600 font-bold text-lg`}>
                            Profile Information
                        </div>
                        <div className="mt-6 mb-7 text-slate-500 font-medium text-[16px] flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row gap-6 [&>*]:w-full">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="first_name" className="">First Name</label>
                                    <input
                                        onChange={handleProfileChange}
                                        type="text" id="first_name" name="first_name"
                                        pattern={"[A-Za-z]*"}
                                        placeholder={userProfile.first_name}
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="last_name" className="">Last Name</label>
                                    <input
                                        onChange={handleProfileChange}
                                        pattern={"[A-Za-z]*"}
                                        type="text" id="last_name" name="last_name"
                                        placeholder={userProfile.last_name}
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="contact_email" className="">Email</label>
                                <input
                                    onChange={handleProfileChange}
                                    type="email" id="contact_email" name="email"
                                    placeholder={userProfile.contact_email}
                                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="phone_number" className="">Phone</label>
                                <input
                                    onChange={handleProfileChange}
                                    type="tel" id="phone_number" name="phone" placeholder={userProfile.phone_number?.toString()}
                                    pattern="\d*" className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>
                        </div>
                        <div className="my-4 profile_error text-red-500 text-md font-semibold">{profileError}</div>
                        <div className={"bg-slate-100 -mx-6 -mb-6 rounded-b-md"}>
                            <div className={"px-6 py-4"}>
                                <button
                                    onClick={saveUserProfile}
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
                                                value={userProfile.registration_key}
                                                onChange={handleProfileChange}
                                                className="border rounded-md px-2 py-1 w-full"
                                            />
                                        </form>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className="mr-2">{keyVisible ? userProfile.registration_key : '***'}</span>
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

                <div className="w-full flex flex-col lg:max-w-fit gap-6">
                    <div className={`${windowClassName} text-slate-600 font-bold text-lg`}>
                        <div className={`text-slate-700 font-bold text-lg`}>
                            How others see you
                        </div>
                        <div className="mt-10 mb-4 flex flex-col items-center gap-1">
                            <div className={"image-container w-[120px] h-[120px]"}>
                                <img
                                    className={"w-full h-full rounded-full object-cover"}
                                    src={userProfile.profile_picture || "/default_profile_picture.png"}
                                    alt={"profile picture"}
                                />
                            </div>
                            <span className={"mt-5 font-semibold"}>{userProfile.first_name} {userProfile.last_name}</span>
                            <span className={"mt-2 font-medium"}>({userProfile.role?.charAt(0).toUpperCase() || ''}{userProfile.role?.slice(1).toLowerCase()})</span>
                            <span className={"text-md font-normal"}>{userProfile.contact_email}</span>
                            <span className={"text-md font-normal mb-[3px]"}>{userProfile.phone_number}</span>
                        </div>
                    </div>

                    <div className={`${windowClassName} text-slate-600 font-bold text-lg`}>
                        <div className="mb-2">
                            <p className="text-gray-700 font-semibold text-lg">
                                Select profile photo
                            </p>
                        </div>
                        <input
                            className={`mt-6 mb-7 relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-sm font-normal text-neutral-700 transition duration-200 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none `}
                            onChange={handleFileChange}
                            type="file" id={"profile_picture"} name={"profile_picture"}
                        />
                        <div className="-mt-3 mb-4 text-red-500 text-[16px] font-semibold">{fileError}</div>
                        <div className={"bg-slate-100 -mx-6 -mb-6 mt-2 rounded-b-md"}>
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