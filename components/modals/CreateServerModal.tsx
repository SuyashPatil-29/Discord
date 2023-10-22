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
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServerRequest } from "@/lib/validators/validServer";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileUpload } from "../FileUpload";
import { useModal } from "@/hooks/use-modal-store";

type Props = {};

const CreateServerModal = (props: Props) => {
    const router = useRouter()

    const {isOpen,onClose,type} = useModal()

    const isModalOpen = isOpen && type === "createServer"

    const handleClose = ()=>{
      onClose()
    }

    const formSchema = z.object({
        name : z.string().min(1,{
            message : "Server name is required"
        }),
        image : z.string().min(1,{
            message : "Server image is required"
        })
    })
    
    const form = useForm({
      resolver : zodResolver(formSchema),
      defaultValues: {
          name : "",
          image : "",
      }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async function(values :z.infer<typeof formSchema>){
        try {
          const payload :ServerRequest = {
            name : values.name,
            image : values.image
          }
          await axios.post("/api/createserver", payload)

          form.reset()
          router.refresh()
          onClose()
        } catch (error) {
          console.log(error);
        }
    }
    
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                      <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateServerModal;
