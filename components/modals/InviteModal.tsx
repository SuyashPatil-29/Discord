"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Props = {};

const InviteModal = (props: Props) => {
  const router = useRouter();
  const {toast} = useToast()
  const origin = useOrigin();
  const { onOpen,isOpen, onClose, type, data } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const { server } = data;

  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    toast({
      title: "Invite link copied to clipboard",
      description: "Your invite link has been copied to your clipboard",
    })

    setCopiedText("Copied to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const generateNewLink = async ()=>{
    try {
      setIsLoading(true)
      const {data} = await axios.patch(`/api/server/${server?.id}/invite-code`)

      onOpen("invite", {server : data})
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isLoading}
              readOnly
            />
            <Button size="icon" onClick={copyToClipboard} disabled={isLoading}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            size="default"
            className="text-xs text-zinc-500 mt-4"
            onClick={generateNewLink}
            disabled={isLoading}
          >
            Generate a new Link <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
