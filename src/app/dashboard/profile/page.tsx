"use client"

import React from 'react';
import Image from 'next/image'
import connection from "@/app/supabase/supabase";

interface ProfileOptions {
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

    const submitProfileOptions = async () => {
        await supabase
            .from('user_profile')
            .upsert([profileOptions])
    }

    const handleProfileChange = (event: any) => {
        const field = event.target.id
        const value = event.target.value
        setProfileOptions(prevState => {
            return {
                ...prevState,
                [field]: value
            }
        })
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
                return
            } else {
                setProfileOptions(data[0])
            }
        }
        fetchData().catch(console.error)
    }, []);

    return (
        <main className="p-8 mt-10">
            <div className="main-content flex flex-col items-center lg:items-start lg:flex-row gap-6 w-full">
                <div className="w-full flex flex-col gap-6">
                    <div className={`${windowClassName} `}>
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
                    <div className={`${windowClassName} w-full text-slate-700 font-bold text-lg`}>
                        Registration key
                    </div>
                </div>

                <div className="w-full flex flex-col sm:max-w-fit gap-6">
                    <div className={`${windowClassName} text-slate-600 font-bold text-lg`}>
                        <div className={`text-slate-700 font-bold text-lg`}>
                            How others see you
                        </div>
                        <div className="mt-16 mb-4 flex flex-col items-center gap-1">
                            <Image
                                className={"rounded-full"}
                                src={profileOptions.profile_picture || "/default_profile_picture.png"}
                                alt={"profile picture"}
                                width={120}
                                height={120}
                                priority={true}
                            />
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
                        Select profile photo
                    </div>
                </div>
            </div>
        </main>

);
}

export default Page;