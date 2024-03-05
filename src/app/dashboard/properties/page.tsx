import DashboardPanel from "@/app/components/Dashboard/DashboardPanel";

function Page() {

    // Title = 'My Rented Unit' if the user_role is a renter
    // Title = 'My Units' if the user_role is a owner
    // Title = 'My Properties' if the user_role is a company


    return (
        <div>
            <DashboardPanel title={'My Rented Unit'} buttonTitle={'Register New Unit'} onClick={() => {}}/>
        </div>
    );
}

export default Page;