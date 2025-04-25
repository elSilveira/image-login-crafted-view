
import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "../sidebar-context"

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("pb-4", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  
  return (
    <h3
      ref={ref}
      className={cn(
        "mb-2 px-4 text-xs font-medium text-muted-foreground data-[state=collapsed]:sr-only",
        className
      )}
      data-state={state}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
SidebarGroupContent.displayName = "SidebarGroupContent"

