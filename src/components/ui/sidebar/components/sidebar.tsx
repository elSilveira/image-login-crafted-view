
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSidebar } from "../sidebar-context"
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE, SIDEBAR_WIDTH_ICON } from "../sidebar-constants"

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

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
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

