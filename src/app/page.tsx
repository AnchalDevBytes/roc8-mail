"use client";
import { Header, MailCard, MailDetail } from '@/components';
import { ApiResponse } from '@/interfaces';
import { MailMetaDataInterface } from '@/interfaces/MailMetaDataInterface';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const HomePage = () => {
  const [mails, setMails] = useState<MailMetaDataInterface[]>([]);
  const [selectedMail, setSelectedMail] = useState<MailMetaDataInterface | null>(null);
  const [filteredMails, setFilteredMails] = useState<MailMetaDataInterface[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const fetchData = async () => {
    try {
      const { data: { list } } : AxiosResponse<ApiResponse<MailMetaDataInterface>> = await axios.get("https://flipkart-email-mock.vercel.app/");

      const mailsWithStatus = list.map((mail) => ({
        ...mail,
        isRead: false,
        isFavorite: false,
      }));

      setMails(mailsWithStatus);
      setFilteredMails(mailsWithStatus);
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

  const filtersMails = () => {
    let filtered = mails;
    if(filter === "read") {
      filtered = mails.filter((mail) => mail.isRead);
    } else if(filter === "unread") {
      filtered = mails.filter((mail) => !mail.isRead);
    } else if(filter === "favorites") {
      filtered = mails.filter((mail) => mail.isFavorite);
    }
    setFilteredMails(filtered);
  };

  useEffect(() => {
    filtersMails();
  },[filter, mails]);

  const toggleFavorite = (mailId : string) => {
    const updateMails = mails.map((mail) => (
      mail.id === mailId ? { ...mail, isFavorite: !mail.isFavorite } : mail
    ));
    setMails(updateMails);
  };

  const markAsRead = (mailId: string) => {
    const updatedMails = mails.map((mail) => (
      mail.id === mailId ? { ...mail, isRead: true } : mail
    ));
    setMails(updatedMails);
  };

  const handleMailClick = (mail: MailMetaDataInterface) => {
    markAsRead(mail.id);
    setSelectedMail(mail);
  }

  const handleBackClick = () => {
    setSelectedMail(null);
  };

  return (
    <>
    <Header setFilter={setFilter}/>
    <div className="flex flex-col lg:flex-row items-center h-[80vh] overflow-y-scroll scrollbar-hide bg-background text-text mt-10 w-full">
      <div className={`${selectedMail ? "w-1/2 hidden lg:block" : "w-full"} h-[80vh] overflow-y-scroll scrollbar-hide`}>
        {filteredMails.length > 0 ? (
          <ul className="space-y-4 w-full">
            {filteredMails.map((mail) => (
              <MailCard key={mail.id} mail={mail} onClick={() => handleMailClick(mail)} selectedMail={selectedMail} />
            ))}
          </ul>
        ) : (
          <div>...loading</div>
        )}
      </div>
      {selectedMail && (
        <div className="w-full lg:w-1/2 lg:ml-10 h-[80vh] overflow-y-scroll scrollbar-hide">
          <div className="block lg:hidden">
            <button 
              className="mb-4 bg-accent text-white px-4 py-1 rounded-md" 
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
          <MailDetail mail={selectedMail} toggleFavorite={() => toggleFavorite(selectedMail.id)} />
        </div>
      )}
    </div>
    </>
  )
}

export default HomePage;
