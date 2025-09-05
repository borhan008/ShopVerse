import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { fetchCategoriesSorted } from "@/app/actions/actions";
import { Category } from "@/generated/prisma";
import UserSidebarBtn from "./user-sidebar-btn";

export default async function UserSidebar() {
  const sortedCategoeies = (await fetchCategoriesSorted()).sortedCategories;
  // console.log("sortedCategoeies", sortedCategoeies);
  type TCat = Category & {
    child?: TCat[];
  };

  const loopCategories = (categories: TCat[], space: number) => {
    return categories.map((category: TCat) => {
      if (category?.child && category?.child.length > 0) {
        return (
          <SidebarMenuItem
            key={category.id}
            style={{ paddingLeft: `${space * 5}px` }}
          >
            <SidebarMenuButton asChild>
              <UserSidebarBtn slug={category.slug}>
                {category.name}
              </UserSidebarBtn>
            </SidebarMenuButton>
            <SidebarMenu>
              {loopCategories(category.child, space + 1)}
            </SidebarMenu>
          </SidebarMenuItem>
        );
      } else {
        return (
          <SidebarMenuItem
            key={category.id}
            style={{ paddingLeft: `${space * 5}px` }}
          >
            <SidebarMenuButton asChild>
              <UserSidebarBtn slug={category.slug}>
                {category.name}
              </UserSidebarBtn>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }
    });
  };
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <UserSidebarBtn slug={""}>{"All"}</UserSidebarBtn>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {sortedCategoeies.map((item) => loopCategories([item], 0))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
