"use client"
import React, { useState } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Template from '@/app/(data)/Template'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { chatSession } from '@/app/utils/AiModels'

interface PROPS{
    params:{
    'template-slug':string
    }
}
function CreateNewContent(props:PROPS) {
    
     const selectedTemplate:TEMPLATE|undefined=Template?.find((item)=>item.slug==props.params['template-slug']);

     const [loading,setLoading]=useState(false);
     const [aiOutput,setAiOutput]=useState<string>('');

     const GenerateAIContent=async(formData:any)=>{
      setLoading(true);
        const SelectedPrompt=selectedTemplate?.aiPrompt;

        const FinalAIPrompt=JSON.stringify(formData)+", "+SelectedPrompt;

        const result=await chatSession.sendMessage(FinalAIPrompt);

        console.log(result.response.text());
        setAiOutput(result?.response.text());
        setLoading(false);
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