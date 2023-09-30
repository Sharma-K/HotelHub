'use client';
import useSearchModal from "@/app/hooks/useSearchModal"
import Modal from "./Modal"
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import qs from 'query-string';
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import Counter from "../inputs/Counter";
enum STEPS{
    TYPE = 0,
    DATE = 1,
    INFO =2
}

const SearchModal = () =>{
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [steps, setStep] = useState(STEPS.TYPE);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathrommCount] = useState(1);
    const [category, setCategory] = useState('');
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
           category,
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

        setStep(STEPS.TYPE);
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
        router,
        category
    ])

    const actionLabel = useMemo(()=>{
        if(steps===STEPS.INFO) return 'Search';
        return 'Next';
    },[steps])

    const secondaryActionLabel = useMemo(()=>{
        if(steps===STEPS.TYPE) return undefined;
        return 'Back'
    },[steps])

    // let bodyContent = (
    //     <div className="flex flex-col gap-8">
    //         <Heading 
    //         title="Where do you wanna go?"
    //         subtitle="Find the perfect location"
    //         />
    //         <CountrySelect 
    //         value={locationValue}
    //         onChange={(value)=>{
    //             setLocation(value as CountrySelectValue)
    //         }}
    //         />
    //         <hr />
    //         <Map center={locationValue?.latlng} />
    //     </div>
    // )
    let bodyContent = (
        <div className="flex flex-col gap-8">
 
         <Heading 
         title="Which of these best describes your place?"
         subtitle="pick a category"
          />
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
            {categories.map((item)=>(
             <div key={item.label} className="col-span-1">
 
             <CategoryInput 
             onClick={(category)=> setCategory(category)} 
             selected={category === item.label} 
             label={item.label} 
             icon={item.icon} 
             />
 
             </div>
            ))}
          </div>
 
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
                title="Persons"
                subtitle="How many Persons are coming"
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
        secondaryAction={steps===STEPS.TYPE?undefined: onBack}
        secondaryActionLabel={ secondaryActionLabel}
        body={bodyContent}
        />

    )
}
export default SearchModal;