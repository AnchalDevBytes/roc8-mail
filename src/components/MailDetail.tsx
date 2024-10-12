"use client";
import { ApiResponse } from '@/interfaces';
import { MailInterface } from '@/interfaces/MailInterface';
import { MailMetaDataInterface } from '@/interfaces/MailMetaDataInterface';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const MailDetail = ({ mail } : { mail: MailMetaDataInterface }) => {
    const [mailBody, setMailBody] = useState<string>("");

    const fetchMailDetail = async () => {
        try {
            const { data } : AxiosResponse<ApiResponse<MailInterface>> = await axios.get(`https://flipkart-email-mock.vercel.app/?id=${mail.id}`);
            console.log("data", data);
            setMailBody(data?.body);
        } catch (error) {
            if(error instanceof Error) {
                toast.error("Error while retrieving mail detail");
              } else {
                toast.error("Unknown error occured while retrieving mail detail");  
              }
        }
    }

    useEffect(() => {
        fetchMailDetail();
    },[mail.id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-border">
      <h2 className="text-lg font-bold">{mail?.subject}</h2>
      <p className="text-gray-600 mb-4">
        From: <span className="font-semibold">{mail?.from?.name}</span> &lt;{mail?.from?.email}&gt;
      </p>
      <p className="text-gray-600 mb-4">
        {new Date(mail?.date).toLocaleDateString()} {new Date(mail?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-gray-800" dangerouslySetInnerHTML={{__html: mailBody || "No content available"}}></p>
    </div>
  )
}

export default MailDetail;
