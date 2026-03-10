// components/layout/UserSidebar.tsx
"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Navigation/SidebarV2";
import { 
  Hammer, 
  Rocket, 
  Zap, 
  Globe, 
  Sparkles, 
  Star,
  Package,
  LayoutDashboard 
} from "lucide-react";

const links = [
  { 
    label: "Dashboard", 
    href: "/blocks", 
    icon: <Rocket className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />
  },
  { 
    label: "Client Onboarding", 
    href: "/intake", 
    icon: <Package className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />,
    subItems: ["Intake Form", "Project Brief", "Requirements Gathering"]
  },
  { 
    label: "Business Consulting", 
    href: "/forge", 
    icon: <Zap className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />,
    subItems: ["Strategy Sessions", "Market Analysis", "Growth Planning"]
  },
  { 
    label: "Digital Development", 
    href: "/#services", 
    icon: <Globe className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />,
    subItems: ["Web Apps", "Mobile Apps", "E-commerce", "Custom Solutions"]
  },
  { 
    label: "Design Services", 
    href: "/#designs", 
    icon: <LayoutDashboard className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />,
    subItems: ["UI/UX Design", "Branding", "3D Modeling", "Video Production"]
  },
  { 
    label: "Workshops", 
    href: "/workshop", 
    icon: <Sparkles className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />,
    subItems: ["Fade In", "Slide Up", "Lightning Effect", "Globe Spin", "Particle Burst"]
  },
  { 
    label: "Backgrounds", 
    href: "/blocks/backgrounds", 
    icon: <Star className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />,
    subItems: ["Gradient BG", "Particle BG", "Energy Tunnel", "Singularity", "Nebula Flow"]
  },
  { 
    label: "Components", 
    href: "#", 
    icon: <Hammer className="w-5 h-5 shrink-0 text-neutral-400 group-hover/sidebar:text-white" />,
    subItems: [
      "Buttons", "Cards", "Forms", "Loaders", "Menus", 
      "Modals", "Navigation", "Pagination", "Typography", 
      "Text Effects", "Bento Grid"
    ]
  },
];

export default function UserSidebar() {
  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}