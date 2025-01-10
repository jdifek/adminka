"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { ClientDialog } from "./client-dialog"
import { useSWRConfig } from "swr"
import { Client } from "./columns"

interface ClientActionsProps {
  client: Client
}

export function ClientActions({ client }: ClientActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { mutate } = useSWRConfig()


  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <ClientDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        client={client}
        onClose={() => {
          setIsEditOpen(false)
          mutate("/api/clients")
        }}
      />
    </>
  )
}
