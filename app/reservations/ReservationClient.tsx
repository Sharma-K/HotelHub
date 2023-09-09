'use client';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { SafeReservation, SafeUser } from '../types';
import Heading from '../components/Heading';
import Container from '../components/Container';
import ListingCard from '../components/listings/ListingCard';
import { useRouter } from 'next/navigation';
interface ReservationClientProps{
    currentUser?: SafeUser
    reservations: SafeReservation[]
}
const ReservationClient:React.FC<ReservationClientProps> = ({currentUser,reservations}) =>{
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');
    const onCancel = useCallback((id: string)=>{
        setDeletingId(id);
        axios.delete(`/api/reservations/${id}`)
        .then(()=>{
            toast.success('Reservation Cancelled');
            router.refresh();
        }).catch((error)=>{
            toast.error('Something went wrong');
        }).finally(()=>{
            setDeletingId('');
        })
    },[router])
    return (
       <Container>
        <Heading 
        title='Reservations'
        subtitle='Bookings on your properties'
        />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {reservations.map((reservation)=>(
                <ListingCard 
                key={reservation.id}
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onCancel}
                disabled={deletingId===reservation.id}
                actionLabel='Cancel guest reservation'
                currentUser={currentUser}
                />
            ))}
        </div>
       </Container>
    )
}
export default ReservationClient;