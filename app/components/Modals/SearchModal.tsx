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
import { BiRupee } from "react-icons/bi";
import Counter from "../inputs/Counter";
enum STEPS{
    TYPE = 0,
    PRICE = 1,
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
    const [price, setPrice] = useState(1);
    const [locationValue, setLocation] = useState<CountrySelectValue>();


    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

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
            bathroomCount,
            price
        };

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
        onNext,
        params,
        router,
        category,
        price
    ])

    const changeHandler = (e: any) =>{
        setPrice(e.target.value);
    }

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

    if(steps===STEPS.PRICE){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="Now, set your price"
                subtitle="How much do you charge per night?"
                />
               {/* <input style={} type="number" id="price" placeholder="Enter price" value={price} onChange={changeHandler} /> */}
               <div className="w-full relative">
            
                <BiRupee className="text-neutral-700 absolute top-5 left-2" />
           
            <input id="price" onChange={changeHandler}  placeholder=" " type="number"
             className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
             'pl-4'
        
            `} />
            <label className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0]  'left-4'
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:translate-y-0
            peer-focus:scale-75
            peer-focus:-translate-y-4
            `}>
            </label>

        </div>
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