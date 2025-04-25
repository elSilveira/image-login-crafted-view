
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "../sidebar-context"

export const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  
  if (state === "expanded") {
    return null
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 z-20 h-full w-px bg-border",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

