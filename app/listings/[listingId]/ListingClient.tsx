'use client';
import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { SafeUser, SafeListing, SafeReservation } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import {differenceInCalendarDays, eachDayOfInterval} from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { Range } from "react-date-range";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'

}
interface ListingClient{
    reservation?: SafeReservation[];
    listing: SafeListing & {
        user: SafeUser
    }
    currentUser: SafeUser | null

}

const ListingClient: React.FC<ListingClient> = ({reservation = [], listing, currentUser}) =>{

    const loginModal = useLoginModal();
    const router = useRouter();

    const disabledDates = useMemo(()=>{
       let dates: Date[] = [];

       reservation.forEach((reservation)=>{
        const range = eachDayOfInterval({
            start: new Date(reservation.startDate),
            end: new Date(reservation.endDate)
        });

        dates = [...dates, ...range];
       
       })
       return dates;
    },[reservation]);


    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    
    const onCreateReservation = useCallback(()=>{
        if(!currentUser) return loginModal.onOpen();
        
        setIsLoading(true);
        axios.post('/api/reservations', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing.id
        }).then(()=>{
            toast.success('Listing reserved!');
            setDateRange(initialDateRange);
            router.push('/trips');
        }).catch(()=>{
            toast.error('Something went wrong');
        }).finally(()=>{
            setIsLoading(false);
        })


    },[
        totalPrice,
        dateRange,
        listing.id,
        router,
        currentUser,
        loginModal
    ]);

    useEffect(()=>{
        if(dateRange.startDate && dateRange.endDate){
          const month = dateRange.endDate.getMonth();
         const year = dateRange.endDate.getFullYear();
 

          
            
            const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
              
            if(dayCount>=1 && listing.price){
                const temp = new Date(year, month+1, 0);
                const day = temp.getDate();
                
            
                if(dayCount>=day-1) setTotalPrice(listing.price);
                else
                setTotalPrice((dayCount*listing.price)/30);
            }
            else{
                
                setTotalPrice(listing.price);
            }
        }
    },[dateRange, listing.price])

    const category = useMemo(() => {
        return categories.find((item)=> item.label===listing.category)
    },[listing.category])
    
    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead 
                    title={listing.title}
                    imageSrc={listing.imageSrc}
                    locationValue={listing.locationValue}
                    id={listing.id}
                    currentUser={currentUser}

                    />
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                     <ListingInfo 
                     user={listing.user}
                     category={category}
                     description={listing.description}
                     roomCount={listing.roomCount}
                     guestCount={listing.guestCount}
                     bathroomCount={listing.bathroomCount}
                     locationValue={listing.locationValue}
                     />

                    <div className="order-first mb-10 md:order-last md:col-span-3">
                        <ListingReservation 
                        price={listing.price}
                        totalPrice={totalPrice}
                        onChangeDate={(value)=> setDateRange(value)}
                        dateRange={dateRange}
                        onSubmit={onCreateReservation}
                        disabled={isLoading}
                        disabledDates={disabledDates}
                        />

                    </div>

                    </div>

                </div>
            </div>
        </Container>
    )
}
export default ListingClient;