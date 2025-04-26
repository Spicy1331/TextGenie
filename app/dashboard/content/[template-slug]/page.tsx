"use client"
import React, { useState,useContext } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Template from '@/app/(data)/Template'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { chatSession } from '@/app/utils/AiModels'
import { db } from '@/app/utils/db'
import { AIOutput } from '@/app/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'


interface PROPS{
    params:{
    'template-slug':string
    }
}
function CreateNewContent(props:PROPS) {
    
     const selectedTemplate:TEMPLATE|undefined=Template?.find((item)=>item.slug==props.params['template-slug']);

     const [loading,setLoading]=useState(false);
     const [aiOutput,setAiOutput]=useState<string>('');
     const {user} =useUser();

     const {totalUsage,setTotalUsage}=useContext(TotalUsageContext);

     const GenerateAIContent=async(formData:any)=>{
      if(totalUsage>=10000){
        console.log("Please Upgrade");
        return ;
      }
      setLoading(true);
        const SelectedPrompt=selectedTemplate?.aiPrompt;
        const FinalAIPrompt=JSON.stringify(formData)+", "+SelectedPrompt;
        const result=await chatSession.sendMessage(FinalAIPrompt);

        setAiOutput(result?.response.text());
        await SaveInDb(JSON.stringify(formData),selectedTemplate?.slug,result?.response.text())
        setLoading(false);
     }

     const SaveInDb=async(formData:any,slug:any,aiResp:string)=>{
      const result=await db.insert(AIOutput).values({
        formData:formData,
        templateSlug:slug,
        aiResponse:aiResp,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD/MM/YYYY'),
      });
      console.log(result);
      
     }
  return (
    <div className='p-10'>
        <Link href={"/dashboard"}>
         <Button><ArrowLeft/>Back</Button>
         </Link>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5'>
        {/* form section */}
         <FormSection selectedTemplate={selectedTemplate}
          userFormInput={(v:any)=>GenerateAIContent(v)}
          loading={loading}/>
        {/* output section */}
        <div className='col-span-2'>
        <OutputSection aiOutput={aiOutput}/>
        </div>
    </div>
    </div>
  )
}

export default CreateNewContent