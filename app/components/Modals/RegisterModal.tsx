'use client';
import axios from "axios";
import {AiFillGithub} from 'react-icons/ai';
import {FcGoogle} from 'react-icons/fc';
import { useCallback, useState } from "react";
import Heading from "../Heading";
import Input from "../inputs/Input";
import {toast} from 'react-hot-toast';
import {
    FieldValues, SubmitHandler, useForm
}  from 'react-hook-form';
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Button from "../Button";
import { signIn } from 'next-auth/react';
import useLoginModal from "@/app/hooks/useLoginModal";

const RegisterModal = () => {
    const RegisterModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const {register, handleSubmit, formState: {errors,}} = useForm<FieldValues>({
        defaultValues:{
            name: '',
            email: '',
            password: ''
        }
    })
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post('/api/register', data).then(() => {
            RegisterModal.onClose();
            loginModal.onOpen();
        }).catch((error)=>{
            toast.error('Something Went Wrong');
          
        }).finally(()=>{
            setIsLoading(false);
        })
    }

    
    const toggle = useCallback(()=>{
        RegisterModal.onClose();
        loginModal.onOpen();

    },[loginModal, RegisterModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Pg Finder" subtitle="Create an account!" />
            <Input id="email" type="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="name" type="text" label="Name" disabled={isLoading} register={register} errors={errors} required />
            <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required />
       
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
            outline
            label="Continue with Google"
            icon={FcGoogle}
            onClick={()=>signIn('google')}

             />
             <Button
            outline
            label="Continue with Github"
            icon={AiFillGithub}
            onClick={()=>signIn('github')}

             />
             <div className="text-neutral-500 text-center mt-4 font-light">
                <div onClick={toggle} className=" justify-center flex flex-row items-center gap-2">
                    <div>
                    Already have an account?
                    </div>
                    <div
                    onClick={toggle}
                     className="text-neutral-800 cursor-pointer hover:underline">
                        Log in
                    </div>
                </div>

             </div>

        </div>
    )

    return (
       <Modal 
       disabled={isLoading}
       isOpen={RegisterModal.isOpen}
       title="Register"
       actionLabel="Continue"
       onClose={RegisterModal.onClose}
       onSubmit={handleSubmit(onSubmit)}
       body={bodyContent}
       footer={footerContent}

       />
    )
}
export default RegisterModal;