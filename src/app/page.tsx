"use client";
import { MailCard, MailDetail } from '@/components';
import { ApiResponse } from '@/interfaces';
import { MailMetaDataInterface } from '@/interfaces/MailMetaDataInterface';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const HomePage = () => {
  const [mails, setMails] = useState<MailMetaDataInterface[]>([]);
  const [selectedMail, setSelectedMail] = useState<MailMetaDataInterface | null>(null);

  const fetchData = async () => {
    try {
      const { data: { list } } : AxiosResponse<ApiResponse<MailMetaDataInterface>> = await axios.get("https://flipkart-email-mock.vercel.app/");
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

  const handleMailClick = (mail: MailMetaDataInterface) => {
    setSelectedMail(mail);
  }

  return (
    <div className="flex items-center h-[80vh] overflow-y-scroll scrollbar-hide bg-background text-text mt-10 w-full">
      <div className={`${selectedMail ? "w-1/2" : "w-full"} h-[80vh] overflow-y-scroll scrollbar-hide`}>
        {mails.length > 0 ? (
          <ul className="space-y-4 w-full">
            {mails.map((mail) => (
              <MailCard key={mail.id} mail={mail} onClick={() => handleMailClick(mail)} selectedMail={selectedMail} />
            ))}
          </ul>
        ) : (
          <div>...loading</div>
        )}
      </div>
      {selectedMail && (
        <div className="w-1/2 ml-10 h-[80vh] overflow-y-scroll scrollbar-hide">
          <MailDetail mail={selectedMail} />
        </div>
      )}
    </div>
  )
}

export default HomePage;
