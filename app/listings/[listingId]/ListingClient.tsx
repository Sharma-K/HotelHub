'use client';
import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listings/ListingHead";
import { SafeUser } from "@/app/types";
import { Listing, Reservation } from "@prisma/client";
import { useMemo } from "react";

interface ListingClient{
    reservation?: Reservation[];
    listing: Listing
    currentUser: SafeUser | null

}

const ListingClient: React.FC<ListingClient> = ({reservation, listing, currentUser}) =>{
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
                    location={listing.locationValue}
                    id={listing.id}
                    currentUser={currentUser}

                    />

                </div>
            </div>
        </Container>
    )
}
export default ListingClient;