import Login from "@/app/components/authentification/Login";
import Logo from "@/app/components/logo/Logo";

export default function Home() {

    return (

        <main>

            <div className="bg-[#FFFFFF]">
                <div className="flex justify-center h-screen">
                    <div className="bg-cover lg:block lg:w-2/3"
                         style={{backgroundImage: 'url("https://images.rentals.ca/property-pictures/large/mississauga-on/253705/apartment-17442588.jpg")'}}
                         data-testid="background-image">
                        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                            <div>
                                <h2 className="text-2xl font-bold text-white sm:text-3xl">Home Haven</h2>
                                <p className="max-w-xl mt-3 text-gray-200">
                                    Welcome to Home Haven. A place where you rent and own properties. We are here to make your life easier.
                                    At Home Haven, we believe that everyone should have a place to call home. We are here to help you find the perfect place to call home.
                                    So, what are you waiting for? Sign up now and start your journey to finding your perfect home.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                        <div className="flex-1  bg-white p-10 rounded-xl">
                            <div className="text-center">
                                <div className="flex justify-center mx-auto mb-10">
                                    <a className={"h-24 w-24"} href="/">
                                        <Logo/>
                                    </a>
                                </div>

                                <p className="mt-3 text-gray-500">Sign in to access your account</p>
                            </div>

                            <div className="mt-8">
                                <Login/>
                                <p className="mt-6 text-sm text-center text-gray-400">Don&#x27;t have an account yet? <a
                                    href="signup"
                                    className="text-blue-500 focus:outline-none focus:underline hover:underline">
                                    Sign up
                                </a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>

    )
}