"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import qs from "query-string";
import { useSession } from "next-auth/react";

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { apiUrl,query } = data;

  const isModalOpen = isOpen && type === "deleteMessage";

  const {data: profile} = useSession()

  const { mutate: handleDeleteMessage } = useMutation({
    mutationFn: async () => {
      const url = qs.stringifyUrl({
        url : apiUrl || "",
        query : {
          ...query,
          profileId : profile?.user.id
        }
      })

      await axios.delete(url);
      setIsLoading(true);
      return data;
    },
    onSuccess: () => {
      setIsLoading(false);
      onClose();
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? {" "}
            <br />
            This message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-400"
              variant="primary"
              onClick={() => handleDeleteMessage()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
