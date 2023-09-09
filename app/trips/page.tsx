import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservation from "../actions/getReservations";
import TripsClient from "./TripsClient";
const TripsPage = async() =>{
    const currentUser = await getCurrentUser();

    if(!currentUser) return (
        <ClientOnly >
            <EmptyState title="Unauthorized" subtitle="Please login" />
        </ClientOnly>
    )
    const reservation = await getReservation({ userId: currentUser.id });

    if(reservation.length===0){
        return (
            <ClientOnly>
                <EmptyState title="No trips found" subtitle="Looks like you have made no reservations" />

            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <TripsClient 
            reservations={reservation}
            currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default TripsPage;