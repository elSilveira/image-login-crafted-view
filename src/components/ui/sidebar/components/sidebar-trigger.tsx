
import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "../sidebar-context"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggleSidebar, state, isMobile, openMobile } = useSidebar()

  if (isMobile) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={toggleSidebar}
        data-state={openMobile ? "open" : "closed"}
        {...props}
      >
        <ChevronLeft className="size-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={toggleSidebar}
      data-state={state}
      {...props}
    >
      <ChevronLeft className={cn(state === "collapsed" && "rotate-180", "size-5")} />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

