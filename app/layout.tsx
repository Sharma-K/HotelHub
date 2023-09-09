import './globals.css'

import { Nunito } from 'next/font/google';
import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/Modals/RegisterModal';
import LoginModal from './components/Modals/LoginModal';
import ToasterProvider from './providers/ToasterProvider';
import getCurrentUser from './actions/getCurrentUser';
import RentModal from './components/Modals/RentModal';
import SearchModal from './components/Modals/SearchModal';
const font = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'HotelHub',
  description: 'Book hotel with one click!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RegisterModal />
          <RentModal />
          <LoginModal />
          <SearchModal />
        <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className='pb-20 pt-20'>
        {children}
        </div>
        </body>
    </html>
  )
}
