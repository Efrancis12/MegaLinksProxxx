"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgeVerificationModal({ isOpen, onClose }: AgeVerificationModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleConfirm = () => {
    // Salvar confirmação no localStorage
    localStorage.setItem("age-verified", "true");
    setOpen(false);
    onClose();
  };

  const handleDeny = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Verificação de Idade
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Este conteúdo é para maiores de 18 anos. 
            <br />
            Você confirma que tem 18 anos ou mais?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleDeny}
            className="w-full sm:w-auto"
          >
            Não, sair
          </Button>
          <Button
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Sim, tenho 18+
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
