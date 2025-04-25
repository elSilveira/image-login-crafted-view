
import * as React from "react"
import { ChevronLeft } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE, SIDEBAR_WIDTH_ICON } from "./sidebar-constants"

const sidebarVariants = cva("", {
  variants: {
    variant: {
      default: "left-0",
      inset: "left-0 top-14 h-[calc(100vh-56px)]",
      modal: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: boolean | "icon"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, collapsible = false, ...props }, ref) => {
    const { state, open, isMobile, openMobile, setOpenMobile } = useSidebar()

    return (
      <>
        <aside
          ref={ref}
          className={cn(
            "fixed inset-y-0 z-30 flex flex-col border-r bg-background transition-all duration-300 data-[state=open]:translate-x-0 sm:data-[state=closed]:translate-x-0",
            isMobile
              ? "w-[18rem] shrink-0 -translate-x-full overflow-y-auto data-[state=open]:shadow-lg"
              : "shrink-0 data-[state=closed]:w-[3rem]",
            collapsible === "icon" && !isMobile
              ? "items-center data-[state=closed]:items-center"
              : "",
            variant === "inset" && "left-0 top-14 h-[calc(100vh-56px)]",
            variant === "modal" && "block h-full",
            className
          )}
          data-state={isMobile ? (openMobile ? "open" : "closed") : state}
          style={{
            width: isMobile
              ? SIDEBAR_WIDTH_MOBILE
              : open
              ? SIDEBAR_WIDTH
              : collapsible === "icon"
              ? SIDEBAR_WIDTH_ICON
              : SIDEBAR_WIDTH,
          }}
          {...props}
        />

        {/* Backdrop */}
        {isMobile && (
          <div
            className={cn(
              "fixed inset-0 z-20 bg-black/80 opacity-0 transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:pointer-events-none",
              variant === "inset" && "top-14 h-[calc(100vh-56px)]"
            )}
            data-state={openMobile ? "open" : "closed"}
            onClick={() => setOpenMobile(false)}
          />
        )}
      </>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-b px-4 data-[state=closed]:justify-center data-[state=closed]:px-0",
        className
      )}
      data-state={state}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
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

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-t px-4 data-[state=closed]:justify-center data-[state=closed]:px-0",
        className
      )}
      data-state={state}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarTrigger = React.forwardRef<
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
      <ChevronLeft className={cn(state === "closed" && "rotate-180", "size-5")} />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarGroup = React.forwardRef<
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

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  
  return (
    <h3
      ref={ref}
      className={cn(
        "mb-2 px-4 text-xs font-medium text-muted-foreground data-[state=closed]:sr-only",
        className
      )}
      data-state={state}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarRail = React.forwardRef<
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

export {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
}
