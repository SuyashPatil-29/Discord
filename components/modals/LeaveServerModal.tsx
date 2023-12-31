"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

type Props = {};

const LeaveServerModal = (props: Props) => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { server } = data;

  const isModalOpen = isOpen && type === "leaveServer";

  const { mutate: handleLeaveServer } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(
        `/api/server/${server?.id}/leave-server`,
      );
      setIsLoading(true);
      return data;
    },
    onSuccess: () => {
      setIsLoading(false);
      onClose();
      router.refresh();
      router.push("/");
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
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
              onClick={() => handleLeaveServer()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
