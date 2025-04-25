
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "../sidebar-context"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-b px-4 data-[state=collapsed]:justify-center data-[state=collapsed]:px-0",
        className
      )}
      data-state={state}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto py-2", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-t px-4 data-[state=collapsed]:justify-center data-[state=collapsed]:px-0",
        className
      )}
      data-state={state}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

