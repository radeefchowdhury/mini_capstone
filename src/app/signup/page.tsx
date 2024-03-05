import Signup from "@/app/components/Authentification/Signup";
import Logo from "@/app/components/Logo/Logo";

export default function Home() {
    return (
        <main>
            <section className="bg-white">
                <div className="flex justify-center min-h-screen">

                    <div className="bg-cover lg:block lg:w-2/5"
                         style={{backgroundImage: 'url("https://www.stayhomesearch.com/wp-content/uploads/2018/11/YUL-condos-rental-9.jpg")'}}>
                    </div>

                    <div className="mt-10 flex flex-col items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                        <div className="flex justify-center mx-auto mb-10">
                            <a className={"h-24 w-24"} href="/">
                                <Logo/>
                            </a>
                        </div>
                        <div className="w-full">
                            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize">
                                Get your free account now.
                            </h1>

                            <p className="mt-4 text-gray-500">
                                Let’s get you all set up so you can verify your personal account and begin setting up
                                your profile.
                            </p>
                            <Signup/>
                            <p className="md:col-span-2 text-sm text-center py-4 text-gray-400">Already have an account? <a
                                href="login"
                                className="text-blue-500 focus:outline-none focus:underline hover:underline">
                                Log in
                            </a>.
                            </p>


                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}