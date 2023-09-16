'use client';
import useSearchModal from "@/app/hooks/useSearchModal"
import Modal from "./Modal"
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import qs from 'query-string';
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import Counter from "../inputs/Counter";
enum STEPS{
    LOCATION = 0,
    DATE = 1,
    INFO =2
}

const SearchModal = () =>{
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [steps, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathrommCount] = useState(1);
    const [locationValue, setLocation] = useState<CountrySelectValue>();

    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    const Map = useMemo(()=>dynamic(()=>import('../Map'),{
        ssr:false
    }),[location]);

    const onBack = useCallback(()=>{
        setStep((value)=> value-1);

    },[])
    const onNext = useCallback(()=>{
        setStep((value)=> value+1);
    },[])

    const onSubmit = useCallback(async()=>{

        if(steps!==STEPS.INFO) return onNext();

        let currentQuery =  {};
        if(params){
            currentQuery = qs.parse(params.toString());
        }
        const updateQuery: any = {
            ...currentQuery,
            locationValue: locationValue?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if(dateRange.startDate){
            updateQuery.startDate = formatISO(dateRange.startDate);
        }
        if(dateRange.endDate){
            updateQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updateQuery
        }, {
            skipNull: true
        })

        setStep(STEPS.LOCATION);
        searchModal.onClose();
        router.push(url);

    },[
        steps,
        searchModal,
        locationValue,
        roomCount,
        bathroomCount,
        guestCount,
        dateRange,
        onNext,
        params,
        router
    ])

    const actionLabel = useMemo(()=>{
        if(steps===STEPS.INFO) return 'Search';
        return 'Next';
    },[steps])

    const secondaryActionLabel = useMemo(()=>{
        if(steps===STEPS.LOCATION) return undefined;
        return 'Back'
    },[steps])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
            title="Where do you wanna go?"
            subtitle="Find the perfect location"
            />
            <CountrySelect 
            value={locationValue}
            onChange={(value)=>{
                setLocation(value as CountrySelectValue)
            }}
            />
            <hr />
            <Map center={locationValue?.latlng} />
        </div>
    )

    if(steps===STEPS.DATE){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="When do you want to go?"
                subtitle="Make sure everyone is free!"
                />
                <Calender 
                value={dateRange}
                onChange={(value)=>{
                    setDateRange(value.selection)
                }}
                />
               
            </div>
        )

    }

    if(steps===STEPS.INFO){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="More information"
                subtitle="Find your perfect location"
                />
                <Counter 
                title="Guests"
                subtitle="How many guests are coming"
                 value={guestCount}
                onChange={(value)=>setGuestCount(value)}
                />
                 <Counter 
                title="Rooms"
                subtitle="How many rooms do you need?"
                 value={roomCount}
                onChange={(value)=>setRoomCount(value)}
                /> <Counter 
                title="Bathrooms"
                subtitle="How many bathrooms do you need?"
                 value={bathroomCount}
                onChange={(value)=>setBathrommCount(value)}
                />
               
            </div>
        )

    }
    
    return (
        <Modal 
        isOpen={searchModal.isOpen}
        onClose={searchModal.onClose}
        onSubmit={onSubmit}
        title="Filters"
        actionLabel={actionLabel}
        secondaryAction={steps===STEPS.LOCATION?undefined: onBack}
        secondaryActionLabel={ secondaryActionLabel}
        body={bodyContent}
        />

    )
}
export default SearchModal;