
import * as React from "react"
import { VariantProps } from "class-variance-authority"
import { sidebarMenuButtonVariants } from "./variants"

export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export interface SidebarContentProps extends React.ComponentProps<"div"> {}

export interface SidebarHeaderProps extends React.ComponentProps<"div"> {}

export interface SidebarFooterProps extends React.ComponentProps<"div"> {}

export interface SidebarGroupProps extends React.ComponentProps<"div"> {}

export interface SidebarMenuProps extends React.ComponentProps<"ul"> {}

export interface SidebarMenuItemProps extends React.ComponentProps<"li"> {}

export interface SidebarMenuButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof import("@radix-ui/react-tooltip").TooltipContent>
}

