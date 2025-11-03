import { Bell, ChevronDown, Factory, Home, LogOut, User, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link"; // Importe o Link para navegação
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectHasUnreadNotifications, verifyHasUnreadNotifications } from "@/store/features/notificationSlice";
import { useEffect } from "react";

// Dados dos itens do menu principal
const items = [
  {
    title: "Página principal",
    url: "/",
    icon: Home,
  },
  {
    title: "Notificações",
    url: "/notification",
    icon: Bell,
  },
  {
    title:'Usuários',
    url:'/user',
    icon:User
  },
  {
    title:'Empresas',
    url:'/enterprise',
    icon:Factory
  }
];

// Dados do submenu colapsável
const collapsibleItems = [
  {
    title: "Visualizar estudantes",
    url: "/student",
  },
  {
    title: "Acompanhamento",
    url: "/student/monitoring",
  },
  {
    title: "Avaliação",
    url: "/student/evaluation",
  },
];

export default function AppSidebar() {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasUnreadNotifications = useSelector(selectHasUnreadNotifications)

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  } 

  useEffect(() => {
    dispatch(verifyHasUnreadNotifications())
  }, [dispatch])

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>Instituto Diomicio Freitas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Itens principais */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <div className="relative">
                        {item.url.includes("notification") && hasUnreadNotifications ? <div className="bg-red-500 w-2 h-2 absolute rounded-full -top-0.5 left-0.5"></div> : ""}
                        <item.icon className="h-5 w-5"/>
                      </div>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Grupo colapsável */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Users className="h-5 w-5" />
                      <span>Estudantes</span>
                      <ChevronDown className="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {collapsibleItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link href={subItem.url} className="pl-8">
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grupo para o item "Sair" */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div onClick={handleLogout} className="text-red-500 hover:text-red-600">
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}