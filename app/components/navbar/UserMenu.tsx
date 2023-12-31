'use client';
import {AiOutlineMenu} from 'react-icons/ai';
import Avatar from '../Avatar';
import MenuItem from './MenuItem';
import { useCallback, useState } from 'react';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import {signOut } from 'next-auth/react';
import { SafeUser } from '@/app/types';
import useRentModal from '@/app/hooks/useRentModal';
import { useRouter } from 'next/navigation';


interface UserMenuProps{
    currentUser?: SafeUser | null
}


const UserMenu: React.FC<UserMenuProps> = ({currentUser}) => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = useCallback(()=>{
        setIsOpen((value)=> !value);
    }, []);
    const onRent = useCallback(()=>{
        if(!currentUser){
           return loginModal.onOpen();
        }
        rentModal.onOpen();
    },[currentUser, loginModal, rentModal]);

    const handleClick = (val: string) => {
        router.push(`/${val}`);
        setIsOpen(false);

    }
    
    return  (
        <div className="relative"> 
        <div className="flex flex-row items-center gap-3">
            <div onClick={onRent} className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 cursor-pointer transition">
               Add your PG
            </div>
            <div onClick={toggleOpen} className="p-4 md:py-1 border-[1px] border-neutral-200 flex flex-row items-center gap-3 cursor-pointer rounded-full hover:shadow-md transition"> 
                 <AiOutlineMenu />
                 <div className="hidden md:block">
                    <Avatar src={currentUser?.image} />
                 </div>
            </div>
        </div>
         {isOpen && (
            <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
                <div className="flex flex-col cursor-pointer">
                    {currentUser? (
                        <>
                    <MenuItem onClick={()=> handleClick('trips')} label='My PG' />
                    <MenuItem onClick={()=>handleClick('favorites')} label='My Favorites' />
                    <MenuItem onClick={()=>handleClick('reservations')} label='My Reservations' />
                    <MenuItem onClick={()=>handleClick('properties')} label='My Properties' />
                    <MenuItem onClick={rentModal.onOpen} label='Add your PG' />
                   
                    <hr />
                    <MenuItem onClick={()=>signOut()} label='Log out' />

                    
                    </>
                    ): (<>
                    <MenuItem onClick={loginModal.onOpen} label='Login' />
                    <MenuItem onClick={registerModal.onOpen} label='SignUp' />

                    </>
                    )
       }
                </div>
            </div>
         )}

        </div>
    )
}
export default UserMenu;