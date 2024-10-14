"use client";
import { Header, MailCard, MailDetail } from '@/components';
import { ApiResponse } from '@/interfaces';
import { MailMetaDataInterface } from '@/interfaces/MailMetaDataInterface';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const HomePage = () => {
  const [mails, setMails] = useState<MailMetaDataInterface[]>([]);
  const [selectedMail, setSelectedMail] = useState<MailMetaDataInterface | null>(null);
  const [filteredMails, setFilteredMails] = useState<MailMetaDataInterface[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const mailsPerPage = 7;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data: { list } } : AxiosResponse<ApiResponse<MailMetaDataInterface>> = await axios.get("https://flipkart-email-mock.vercel.app/");

      const mailsWithStatus = list.map((mail) => ({
        ...mail,
        isRead: false,
        isFavorite: false,
      }));

      setMails(mailsWithStatus);
      setFilteredMails(mailsWithStatus);
      setIsLoading(false);
    } catch (error) {
      if(error instanceof Error) {
        toast.error("Error while retrieving mails");
      } else {
        toast.error("Unknown error occured while retrieving mails");  
      }
      setIsLoading(false);
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
    setCurrentPage(1);
  },[filter, mails]);

  const toggleFavorite = (mailId : string) => {
    const updateMails = mails.map((mail) => (
      mail.id === mailId ? { ...mail, isFavorite: !mail.isFavorite } : mail
    ));
    setMails(updateMails);
    if(selectedMail && selectedMail.id === mailId) {
      setSelectedMail((prev) => prev ? { ...prev, isFavorite : !prev.isFavorite } : null);
    }
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

  const startIndex = (currentPage - 1) * mailsPerPage;
  const currentMails = filteredMails.slice(startIndex, (startIndex + mailsPerPage));
  const totalPages = Math.ceil(filteredMails.length / mailsPerPage);

  const handleNextPage = () => {
    if(currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } 
  }

  const handlePreviousPage = () => {
    if(currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <>
    <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center'>
      <Header setFilter={setFilter} filter={filter}/>
      <div className='flex justify-between w-1/2 lg:w-1/6 items-center mt-4'>
        <button 
          className={`${currentPage === 1 ? 'text-text' : 'text-accent'}`}
          onClick={handlePreviousPage}
        >
          <IoIosArrowBack className='text-2xl font-bold' />
        </button>
        <span className="text-sm text-gray-700">{currentPage} of {totalPages}</span>
        <button 
          className={`${currentPage === totalPages ? 'text-text' : 'text-accent'}`}
          onClick={handleNextPage}
        >
          <IoIosArrowForward className='text-2xl font-bold' />
        </button>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row items-center h-[80vh] overflow-y-scroll scrollbar-hide bg-background text-text mt-10 w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full tracking-widest text-3xl font-medium animate-pulse text-accent">
          Loading...
        </div>
      ) : currentMails.length > 0 ? (
            <div className={`${selectedMail ? "w-1/2 hidden lg:block" : "w-full"} h-[80vh] overflow-y-scroll scrollbar-hide`}>
              <ul className="space-y-4 w-full">
                {currentMails.map((mail) => (
                  <MailCard key={mail.id} mail={mail} onClick={() => handleMailClick(mail)} selectedMail={selectedMail} />
                ))}
              </ul>
            </div>
        ) : (
          <div className='flex items-center justify-center h-full w-full tracking-widest text-3xl font-medium animate-pulse text-accent'>No mails found</div>
      )}
      
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
