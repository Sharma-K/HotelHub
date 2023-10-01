'use client';
import useCountries from '@/app/hooks/useCountries';
import useSearchModal from '@/app/hooks/useSearchModal';
import { differenceInDays } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import {BiSearch} from 'react-icons/bi';
const Search = () =>{
    const searchModal = useSearchModal();
    const params = useSearchParams();
    const {getByValue} = useCountries();
    const locationValue = params?.get('locationValue');
    const startDate = params?.get('startDate');
    const endDate = params?.get('endDate');
    const guestCount = params?.get('guestCount');
    const category = params?.get('category');
    const price = params?.get('price');

    const locationLabel = useMemo(()=>{
       
        if(category) return `${category}`;

        return 'Any Type';
    }, [getByValue, locationValue]);

    const priceLabel = useMemo(()=>{
        if(price){
            return `${price} night`
        }
        return "Any Budget"
    },[price]);

    const guestLabel = useMemo(()=>{
        if(guestCount) return `${guestCount} Person`;

        return 'Add Person';
    },[guestCount])


    return (
        <div onClick={searchModal.onOpen} className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-semibold px-6">
                {locationLabel}

            </div>
            <div className="hidden sm:block text0sm font-semibold px-6 border-x-[1px] flex-1 text-center">
                {priceLabel}
                
            </div>
            <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                <div className="hidden sm:block">
                    {guestLabel}
                </div>
                <div className="p-2 bg-purple-500 rounded-full text-white">
                    <BiSearch size={18} />
                </div>
            </div>

            </div>
        </div>
    )
}
export default Search;