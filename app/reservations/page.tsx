import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservation from "../actions/getReservations";
import ReservationClient from "./ReservationClient";
const ReservationsPage = async() => {
    const currentUser = await getCurrentUser();
    if(!currentUser){
        return (
            <ClientOnly>
                <EmptyState title="Unauthorized" subtitle="Please login" />
            </ClientOnly>
        )
    }
    const reservations = await getReservation({
        authorId: currentUser.id
    })
    if(reservations.length===0){
        <ClientOnly>
                <EmptyState title="No reservations found" subtitle="Looks like you have no reservations on your property" />
            </ClientOnly>
    }

    return (
        <ClientOnly>
            <ReservationClient 
            reservations={reservations}
            currentUser={currentUser}
            />
        </ClientOnly>
    )
    
}
export default ReservationsPage;