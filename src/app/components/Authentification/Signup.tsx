"use client";
import {useState} from 'react';
import connection from '../../supabase/supabase';

const SignUp = () => {
    const supabase = connection;

    const [error, setError] = useState('');
    const [userType, setUserType] = useState('renter');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const handleUserTypeChange = (selectedType: string) => {
        setUserType(selectedType);
    };

    const handleFirstNameChange = (event: any) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event: any) => {
        setLastName(event.target.value);
    };

    const handlePhoneChange = (event: any) => {
        setPhone(event.target.value);
    };

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    const signUpWithEmail = async (email: string, password: string) => {
        const { data, error} = await supabase.auth.signUp({
            email,
            password
        });

        // Get user id from supabase
        const id = data?.user?.id;

        if (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
            return;
        }
        const user_profile_data = {
            id,
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            contact_email: email,
            role: userType.toUpperCase()
        }

        await createUserProfile(user_profile_data)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setPasswordMatchError(true);
            return;
        }
        setPasswordMatchError(false);
        await signUpWithEmail(email, password);
    };

    const createUserProfile = async (data: any) => {
        supabase
            .from('user_profile')
            .insert([data])
            .then(response => {
                if(response.error) console.log('Error creating user profile:', response.error)
                else{
                    console.log('User profile created:', response)
                    window.location.href = '/login';
                }
            })
    }

    return (
        <div>
            <div className="mt-6">
                <h1 className="text-gray-500">Select type of account</h1>

                <div className="mt-3 md:flex md:items-center md:-mx-2">
                    <button autoFocus={true}
                        className={`${userType === 'renter' ? 'bg-[#5752DA] text-white' : 'text-[#5752DA]'} flex justify-center w-full px-6 py-3 mt-4 hover:text-white border border-[#5752DA] rounded-lg md:mt-0 md:w-auto md:mx-2 focus:outline-none hover:bg-[#5752DA] focus:bg-[#5752DA]`}
                        onClick={() => handleUserTypeChange('renter')}
                    >
                        I wish to rent
                    </button>
                    <button
                        className={`${userType === 'owner' ? 'bg-[#5752DA] text-white' : 'text-[#5752DA]'} flex justify-center w-full px-6 py-3 mt-4 hover:text-white border border-[#5752DA] rounded-lg md:mt-0 md:w-auto md:mx-2 focus:outline-none hover:bg-[#5752DA] focus:bg-[#5752DA]`}
                        onClick={() => handleUserTypeChange('owner')}
                    >
                        I own a condo
                    </button>
                </div>
            </div>

            <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2" onSubmit={handleSubmit}>
                <div>
                    <label className="block mb-2 text-sm text-gray-600">First
                        Name</label>
                    <input type="text" placeholder="John" value={firstName} onChange={handleFirstNameChange} required
                           className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-[#5752DA] focus:ring-[#5752DA] focus:outline-none focus:ring focus:ring-opacity-40"/>
                </div>

                <div>
                    <label className="block mb-2 text-sm text-gray-600">Last
                        name</label>
                    <input type="text" placeholder="Snow" value={lastName} onChange={handleLastNameChange} required
                           className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-[#5752DA] focus:ring-[#5752DA] focus:outline-none focus:ring focus:ring-opacity-40"/>
                </div>

                <div>
                    <label className="block mb-2 text-sm text-gray-600">Phone
                        number</label>
                    <input type="text" placeholder="XXX-XXX-XXXX" value={phone} onChange={handlePhoneChange} required
                           className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-[#5752DA] focus:ring-[#5752DA] focus:outline-none focus:ring focus:ring-opacity-40"/>
                </div>

                <div>
                    <label className="block mb-2 text-sm text-gray-600">Email
                        address</label>
                    <input type="email" placeholder="johnsnow@example.com" value={email} onChange={handleEmailChange}
                           required
                           className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-[#5752DA] focus:ring-[#5752DA] focus:outline-none focus:ring focus:ring-opacity-40"/>
                </div>

                <div>
                    <label
                        className="block mb-2 text-sm text-gray-600">Password</label>
                    <input type="password" placeholder="Enter your password" value={password}
                           onChange={handlePasswordChange} required
                           className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-[#5752DA] focus:ring-[#5752DA] focus:outline-none focus:ring focus:ring-opacity-40"/>
                </div>

                <div>
                    <label className="block mb-2 text-sm text-gray-600">Confirm password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        name="confirmPassword"
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordMatchError(false); // Reset error on input change
                        }}
                        required
                        className={`block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-[#5752DA] ${
                            passwordMatchError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#5752DA]'
                        } focus:outline-none focus:ring focus:ring-opacity-40`}
                    />
                    {passwordMatchError && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match. Please try again.</p>
                    )}
                </div>
                <div className={`${error ? 'block' : 'hidden'}`}>
                    <p className="text-sm text-red-500">{error}</p>
                </div>
                <p className="md:col-span-2 text-sm text-center text-gray-400">Already have an account? <a
                    href="login"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline">
                    Log in
                </a>.
                </p>

                <button type={"submit"}
                        className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#5752DA] rounded-lg hover:bg-[#5752DA] focus:outline-none focus:ring focus:ring-[#5752DA] focus:ring-opacity-50">
                    <span>Sign Up </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:-scale-x-100"
                         viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </form>


        </div>
    );
};

export default SignUp;
