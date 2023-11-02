"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileUpload } from "../FileUpload";
import qs from "query-string"
import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {};

const AttctchFileModal = (props: Props) => {
    const {data:{apiUrl,query},isOpen,onClose,onOpen,type} = useModal()
    const router = useRouter();
    const {data :profile} = useSession() 
    const [pdfName, setPdfName] = useState("");

    const isModalOpen = isOpen && type === "messageFile"

    const formSchema = z.object({
        fileUrl : z.string().min(1,{
            message : "Attatchment is required"
        })
    })
    
    const form = useForm({
      resolver : zodResolver(formSchema),
      defaultValues: {
          fileUrl : "",
      }
    })

    const handleClose = ()=>{
      form.reset()
      onClose()
    }

    const isLoading = form.formState.isSubmitting

    const onSubmit = async function(values :z.infer<typeof formSchema>){
        try {
          const {fileUrl} = values;
          const payload = {
            profile,
            fileUrl,
            content : pdfName
          }
          const url= qs.stringifyUrl({
            url : apiUrl || "",
            query,
          })
    
          await axios.post(url,payload)

          form.reset()
          router.refresh()
          handleClose()

        } catch (error) {
          console.log(error);
        }
    }

    const handlePdfNameUpdate = (newPdfName : string) => {
      setPdfName(newPdfName);
    }
    
    
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attatchment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                      <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                          onUploadSuccess={handlePdfNameUpdate}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AttctchFileModal;
