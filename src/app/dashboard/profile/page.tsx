"use client"

import React, {useEffect} from 'react';
import {CompanyType, UserProfileType} from "@/app/constants/types";
import {
    getProfilePictureURL,
    getUserProfileById, getUserSession,
    submitUserProfile,
    uploadProfilePicture
} from "@/app/api/userprofile/UserProfileAPI";
import {getCompanyProfile, submitCompanyProfile} from "@/app/api/company/CompanyAPI";

function Page() {
    const windowClassName = "w-full p-6 bg-white shadow-sm rounded-md";

    const [userType, setUserType] = React.useState<'RENTER' | 'OWNER' | 'COMPANY' | null>(null);
    const [userProfile, setUserProfile] = React.useState<UserProfileType>({} as UserProfileType);
    const [companyProfile, setCompanyProfile] = React.useState<CompanyType>({} as CompanyType);

    const [profilePictureFile, setProfilePictureFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState(false);

    const [profileError, setProfileError] = React.useState<string>('');
    const [fileError, setFileError] = React.useState<string>('');


    const saveProfileChanges = () => {
        setProfileError('');
        if (userType === 'COMPANY' && checkCompanyProfileValidity())
            submitCompanyProfile(companyProfile).catch(console.error)
        if ((userType === 'RENTER' || userType === 'OWNER') && checkUserProfileValidity())
            submitUserProfile(userProfile).catch(console.error)
    }

    const updateUserProfile = (field: keyof UserProfileType, value: string) => {
        setUserProfile(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    const updateCompanyProfile = (field: keyof CompanyType, value: string) => {
        setCompanyProfile(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    const fetchUserData = async () => {
        const userSession = await getUserSession()
        if (!userSession) {
            window.location.href = '/login'
            return
        }
        const {data, error} = await getUserProfileById(userSession.user.id)
        if (error || !data){
            console.error(error?.message || 'Error fetching user profile')
            return
        }
        if(data[0].profile_picture) data[0].profile_picture += `?${Date.now()}`
        setUserProfile(data[0])
    }

    const fetchCompanyData = async () => {
        const userSession = await getUserSession()
        if (!userSession) window.location.href = '/login'

        const {data, error} = await getCompanyProfile()
        if (error || !data){
            console.error(error?.message || 'Error fetching company profile')
            return
        }
        setCompanyProfile(data[0])
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
                updateUserProfile('profile_picture', imageURL)
            })
            .catch(console.error);
    }

    const handleUserProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = event.target.id as keyof UserProfileType;
        const prevValue = userProfile[field as keyof UserProfileType] || '';
        const isValid = event.target.validity.valid;
        const value = event.target.value;

        if (!isValid && value !== '' && field !== 'contact_email') {
            event.target.value = prevValue.toString();
            return
        }
        updateUserProfile(field, value)
    }

    const handleCompanyProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = event.target.id as keyof CompanyType;
        const prevValue = companyProfile[field as keyof CompanyType] || '';
        const isValid = event.target.validity.valid;
        const value = event.target.value;

        if (!isValid && value !== '' && field !== 'email') {
            event.target.value = prevValue.toString();
            return
        }
        updateCompanyProfile(field, value)
    }

    const checkUserProfileValidity = () => {
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

    const checkCompanyProfileValidity = () => {
        // Check name is not empty and is at least 3 characters long
        if (!companyProfile.name || companyProfile.name.length < 3) {
            setProfileError('Company name must be at least 3 characters long');
            return false
        }
        // Check email pattern using regex
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!companyProfile.email?.match(emailPattern)) {
            setProfileError('Invalid email');
            return false
        }
        // Check phone number pattern using regex
        const phonePattern = /^\d{10}$/;
        if (!companyProfile.phone_number?.toString().match(phonePattern)) {
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
        updateUserProfile('profile_picture', fileURL)
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
            updateUserProfile('profile_picture', userProfile.profile_picture + `?${Date.now()}`)
        }
    }, [userProfile.profile_picture])

    // Fetch user profile data
    React.useEffect(() => {
        setUserType(localStorage.getItem('user_role') as 'RENTER' | 'OWNER' | 'COMPANY')
    }, []);

    React.useEffect(() => {
        if (userType === 'COMPANY') fetchCompanyData().catch(console.error)
        else if (userType === 'RENTER' || userType === 'OWNER') fetchUserData().catch(console.error)
    }, [userType]);

    return (
        <main className="">
            {userType && <div className="main-content flex flex-col items-center lg:items-start lg:flex-row gap-6 w-full">
                <div className="w-full flex flex-col gap-6">
                    <div className={`${windowClassName}`}>
                        <div className={`w-full text-slate-600 font-bold text-lg`}>
                            {userType === "COMPANY" ? "Company" : "User"} Profile
                        </div>
                        <div className="mt-6 mb-7 text-slate-500 font-medium text-[16px] flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row gap-6 [&>*]:w-full">
                                {(userType === "RENTER" || userType === "OWNER") &&
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="first_name" className="">First Name</label>
                                    <input
                                        onChange={handleUserProfileChange}
                                        type="text" id="first_name" name="first_name"
                                        pattern={"[A-Za-z]*"}
                                        placeholder={userProfile.first_name}
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>}
                                {(userType === "RENTER" || userType === "OWNER") &&
                                    <div className="flex flex-col gap-1">
                                    <label htmlFor="last_name" className="">Last Name</label>
                                    <input
                                        onChange={handleUserProfileChange}
                                        pattern={"[A-Za-z]*"}
                                        type="text" id="last_name" name="last_name"
                                        placeholder={userProfile.last_name}
                                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                </div>}
                                {userType === "COMPANY" &&
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="last_name" className="">Company Name</label>
                                        <input
                                            onChange={handleCompanyProfileChange}
                                            pattern={"[A-Za-z]*"}
                                            type="text" id={"name"} name="name"
                                            placeholder={companyProfile.name}
                                            className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                                    </div>}
                            </div>
                            {(userType === "RENTER" || userType === "OWNER") &&
                            <div className="flex flex-col gap-1">
                                <label htmlFor="contact_email" className="">Email</label>
                                <input
                                    onChange={handleUserProfileChange}
                                    type="email" id={'contact_email'} name="email"
                                    placeholder={userProfile.contact_email}
                                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>}
                            {userType === "COMPANY" &&
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="">Email</label>
                                <input
                                    onChange={handleCompanyProfileChange}
                                    type="email" id={'email'} name="email"
                                    placeholder={companyProfile.email}
                                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>}
                            {(userType === "RENTER" || userType === "OWNER") &&
                            <div className="flex flex-col gap-1">
                                <label htmlFor="phone_number" className="">Phone</label>
                                <input
                                    onChange={handleUserProfileChange}
                                    type="tel" id="phone_number" name="phone" placeholder={userProfile.phone_number?.toString()}
                                    pattern="\d*" className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>}
                            {userType === "COMPANY" &&
                            <div className="flex flex-col gap-1">
                                <label htmlFor="phone_number" className="">Phone</label>
                                <input
                                    onChange={handleCompanyProfileChange}
                                    type="tel" id="phone_number" name="phone" placeholder={companyProfile.phone_number?.toString()}
                                    pattern="\d*" className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                            </div>}
                        </div>
                        <div className="my-4 profile_error text-red-500 text-md font-medium">{profileError}</div>
                        <div className={"bg-slate-100 -mx-6 -mb-6 rounded-b-md"}>
                            <div className={"px-6 py-4"}>
                                <button
                                    onClick={saveProfileChanges}
                                    className="px-4 py-4 h-7 bg-indigo-500 rounded-lg hover:bg-indigo-600 text-md justify-center items-center gap-2.5 inline-flex">
                                    <span className="font-semibold text-white">Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {(userType === "RENTER" || userType === "OWNER") &&
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
                            type="file" data-testid="profile-picture-upload" id={"profile_picture"} name={"profile_picture"}
                        />
                        <div className="-mt-3 mb-4 text-red-500 text-[16px] font-medium">{fileError}</div>
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
                </div>}
            </div>}
        </main>

    );
}

export default Page;