'use client';
import Container from "../Container";
import {PiParkLight} from 'react-icons/pi'
import { MdOutlineVilla} from 'react-icons/md';
import {BsShop, BsHospital} from 'react-icons/bs';
import {IoDiamond, IoLibraryOutline} from 'react-icons/io5';
import {IoIosFitness, IoIosCafe} from 'react-icons/io';
import {FaTrainSubway} from 'react-icons/fa6'
import {MdTempleHindu} from 'react-icons/md'
import CategoryBox from "../CategoryBox";

import { usePathname, useSearchParams } from "next/navigation";

export const categories = [
   
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'This pg is modern'
    },
    {
        label: 'Gym',
        icon: IoIosFitness,
        description: 'This pg is near Gym'
    },
    {
        label: 'Metro',
        icon: FaTrainSubway,
        description: 'This pg is near Metro Station'
    },
    {
        label: 'Cafe',
        icon: IoIosCafe,
        description: 'This pg is near Cafe'
    },
    {
        label: 'Library',
        icon: IoLibraryOutline,
        description: 'This pg is near Library'
    },
    {
        label: 'Park',
        icon: PiParkLight,
        description: 'This pg is close to Park'
    },
    {
        label: 'Hospital',
        icon: BsHospital,
        description: 'This pg is near Hospital'
    },
    {
        label: 'Lux',
        icon: IoDiamond,
        description: 'This pg is luxurious'
    },
    {
        label: 'Market',
        icon: BsShop,
        description: 'This pg is near Market'
    },
    {
        label: 'Temple',
        icon: MdTempleHindu,
        description: 'This pg is close to Temple'
    }
]
const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    const isMainPage = pathname === '/';
    if(!isMainPage) return null;

    return (
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
               {categories.map((item)=>(
                <CategoryBox
                key={item.label}
                label={item.label}
                selected={category===item.label}
                icon={item.icon}
                 />
               ))}
            </div>
        </Container>
    )
}
export default Categories;