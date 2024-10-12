"use client";
import { MailCard } from '@/components';
import { ApiResponse } from '@/interfaces';
import { MailMetaDataInterface } from '@/interfaces/MailMetaDataInterface';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const HomePage = () => {
  const [mails, setMails] = useState<MailMetaDataInterface[]>([]);

  const fetchData = async () => {
    try {
      const { data: { list } } : AxiosResponse<ApiResponse<MailMetaDataInterface>> = await axios.get("https://flipkart-email-mock.vercel.app/");
      console.log(list);
      setMails(list);
    } catch (error) {
      if(error instanceof Error) {
        toast.error("Error while retrieving mails");
      } else {
        toast.error("Unknown error occured while retrieving mails");  
      }
    }
  }

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <div className='flex flex-col items-center h-[80vh] overflow-y-scroll bg-background text-text mt-10'>
      {mails.length > 0 ? (
        <ul className='space-y-4 w-full'>
          {mails.map((mail) => (
            <MailCard key={mail.id} mail={mail}/>
          ))}
        </ul>
      ) : (
        <div>
          ...loading
        </div>
      )}
    </div>
  )
}

export default HomePage;
