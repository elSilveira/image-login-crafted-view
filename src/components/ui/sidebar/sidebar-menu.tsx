
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

interface SidebarMenuProps extends React.ComponentProps<"div"> {}

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-2 [&_[data-collapsed]]:hidden", className)}
        {...props}
      />
    )
  }
)
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps extends React.ComponentProps<"div"> {}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pb-1", className)}
        {...props}
      />
    )
  }
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const menuButtonVariants = cva(
  "group flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:bg-muted hover:text-foreground",
        destructive:
          "bg-transparent text-red-500 hover:bg-destructive/10 hover:text-destructive",
      },
      isActive: {
        true: "bg-muted/50 text-foreground",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      isActive: false,
    },
  }
)

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuButtonVariants> {
  tooltip?: string
  isActive?: boolean
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      className,
      variant,
      isActive = false,
      tooltip,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar()
    const Comp = asChild ? React.Fragment : "button"
    const childProps = asChild ? (props as any).children.props : {}

    return (
      <span className="relative" data-tooltip={tooltip}>
        {state === "collapsed" && tooltip ? (
          <span className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-muted px-2 py-1 text-xs font-medium opacity-0 shadow-sm group-hover:opacity-100">
            {tooltip}
          </span>
        ) : null}
        <Comp
          ref={ref}
          className={cn(menuButtonVariants({ isActive, variant, className }))}
          {...childProps}
          {...(!asChild ? props : {})}
        >
          {(props as any).children}
        </Comp>
      </span>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export { SidebarMenu, SidebarMenuItem, SidebarMenuButton }
