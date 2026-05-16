import { ChevronDown, Factory, Home, LogOut, User, Users, Wrench } from "lucide-react";
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
import { logoutUser, selectCurrentUser } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { can } from "@/functions/can";
import { useSelector } from "react-redux";

// Dados dos itens do menu principal
const items = [
  {
    identifier:'home',
    title: "Página principal",
    url: "/",
    icon: Home,
  },
  {
    identifier:'user',
    title:'Usuários',
    url:'/user',
    icon:User
  },
  {
    identifier:'enterprise',
    title:'Empresas',
    url:'/enterprise',
    icon:Factory
  },
  {
    identifier:'job',
    title:'Cargos',
    url:'/job',
    icon:Wrench
  }
];

// Dados do submenu colapsável
const collapsibleItems = [
  {
    identifier:'student',
    title: "Visualizar alunos",
    url: "/student",
  },
  {
    identifier:'referral',
    title: "Encaminhamento",
    url: "/student/referral",
  },
  {
    identifier:'monitoring',
    title: "Acompanhamento",
    url: "/student/monitoring",
  },
  {
    identifier:'evaluation',
    title: "Avaliação",
    url: "/student/evaluation",
  },
];

export default function AppSidebar() {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  } 

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>Instituto Diomicio Freitas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Itens principais */}
              {items.filter((item) => {
                return item.identifier === "home" || can(currentUser, item.identifier, "read") || can(currentUser, item.identifier, "create");
              }).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <div className="relative">
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
                      <span>Alunos</span>
                      <ChevronDown className="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {collapsibleItems.filter((item) => {
                        return can(currentUser, item.identifier, "read") || can(currentUser, item.identifier, "create");
                      }).map((subItem) => (
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