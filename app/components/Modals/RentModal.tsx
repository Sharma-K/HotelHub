'use client';

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { useState, useMemo } from "react";
import { categories } from "../navbar/Categories";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


enum STEPS{
    CATEGORY=0,
    LOCATION=1,
    INFO=2,
    IMAGES=3,
    DESCRIPTION=4,
    PRICE=5
}

const RentModal = ( ) =>{
    const rentModal = useRentModal();
    const [steps, setSteps] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLaoding] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, setValue, watch, 
        formState: {
        errors,
    }, reset} = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
             }
    });
     const category = watch('category');
     const location = watch('location');
     const guestCount = watch('guestCount');
     const roomCount = watch('roomCount');
     const bathroomCount = watch('bathroomCount');
     const imageSrc = watch('imageSrc');


     const Map  = useMemo(()=>dynamic(()=> import('../Map'), {
        ssr: false
     }), [location]);

    //  setValue changes values without rerendering the page
     const setCustomValue = (id: string, value: any) =>{
        setValue(id, value, {
            shouldDirty: true, 
            shouldTouch: true,
            shouldValidate: true
        });
     }

    const onBack = () =>{
        setSteps((val)=>val-1);
    }
    const onNext = () =>{
        if(steps==STEPS.CATEGORY){
            if(!category){
                toast.error('Cannot be empty');
                return;
            }
        }
        if(steps==STEPS.LOCATION){
            if(!location){
                toast.error('Select a location');
                return;
            }
        }
        if(steps==STEPS.IMAGES){
            if(!imageSrc){
                toast.error('Please add an image');
                return;
            }
        }
       
        setSteps((val) => val+1);
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if(steps !== STEPS.PRICE){
            return onNext();
        }
        setIsLaoding(true);
        axios.post('/api/listings', data)
        .then(()=>{
            toast.success('Listing Created');
            router.refresh();
            setSteps(STEPS.CATEGORY);
            rentModal.onClose();
            
        }).catch(()=>{
            toast.error('Something went wrong');
        }).finally(()=>{
            setIsLaoding(false);
        })
    }

    const actionLabel = useMemo(()=>{
        if(steps ===STEPS.PRICE){
            return 'Create';
        }
        return 'Next';
    },[steps]);

    const secondaryACtionLabel = useMemo(()=>{
        if(steps===STEPS.CATEGORY){
            return undefined;
        }
        return 'Back';
    },[steps])

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
            onClick={(category)=> setCustomValue('category', category)} 
            selected={category === item.label} 
            label={item.label} 
            icon={item.icon} 
            />

            </div>
           ))}
         </div>

       </div>
    )

    if(steps===STEPS.LOCATION){
          bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="Where is your place loacted?"
                subtitle="Help others find you"
                />
                <CountrySelect
                onChange={(value)=> setCustomValue('location', value)}
                value={location}
                 />
                 <Map center={location?.latlng} />
            </div>
          )
    }

    if(steps===STEPS.INFO){
        bodyContent =(
            <div className="flex flex-col gap-8">
                <Heading 
                title="Share some basics about your place"
                subtitle="What amenities do you have?"
                />
                <Counter
                title="Persons"
                subtitle="How many person do you allow?"
                value={guestCount}
                onChange={(value)=>setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                title="Rooms"
                subtitle="How Many Rooms do you have?"
                value={roomCount}
                onChange={(value)=>setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                title="BathRooms"
                subtitle="How Many BathRooms do you have?"
                value={bathroomCount}
                onChange={(value)=>setCustomValue('bathroomCount', value)}
                />

            </div>
        )
    }

    if(steps===STEPS.IMAGES){
        bodyContent=(
            <div className="flex flex-col gap-8">
                <Heading 
                title="Add a photo of your place"
                subtitle="Show others what your place looks like"
                />
                <ImageUpload 
                value={imageSrc}
                onChange={(value)=> setCustomValue('imageSrc', value)}
                 />
            </div>
        )
    }

    if(steps===STEPS.DESCRIPTION){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="How would you describe your place?"
                subtitle="Short and sweet works best!"
                />
                <Input 
                id="title"
                label="Title"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                />
                <hr />
                <Input 
                id="description"
                label="Description"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                />

            </div>
        )
    }

    if(steps === STEPS.PRICE){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="Now, set your price"
                subtitle="How much do you charge per month?"
                />
                <Input 
                id="price"
                label="Price"
                formatPrice
                type="number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required

                />

            </div>
        )
    }

    return(
        <Modal 
        isOpen={rentModal.isOpen} 
        onClose={rentModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        title="PgFind your Pg"
        secondaryActionLabel={secondaryACtionLabel}
        secondaryAction={steps===STEPS.CATEGORY?undefined: onBack}
        body={bodyContent}
        />
    )
}
export default RentModal;