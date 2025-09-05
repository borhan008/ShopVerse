"use client";

import { deleteUserAdmin, fetchUsersAdmin } from "@/app/actions/actions";
import AdminUserOrderDetails from "@/components/admin-user-order-details";
import H1 from "@/components/h1";
import PaginationGeneric from "@/components/pagination-genetic";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { User } from "@/generated/prisma";
import { TOrder } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

type TUserData = Omit<User, "password" | "updatedAt"> & {
  orders: {
    total: number;
  }[];
};

export default function Page() {
  const [data, setData] = useState<TUserData[] | null>(null);
  const [perPage, setPerPage] = useState(10);
  const [skip, setSkip] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectDeleteUser, setSelectDeleteUser] = useState<string>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchUsersAdmin(skip, perPage);
      if (res?.data) setData(res.data);
      if (res?.total) setTotalUsers(res.total);
    };
    fetchData();
  }, [skip]);

  return (
    <div>
      <H1>Users Management</H1>

      <Table className="w-full my-8">
        <TableHeader className="bg-zinc-100">
          <TableRow>
            <TableHead className="max-w-[20px]">SL</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Total Purchase</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((user, idx) => (
            <TableRow key={user.id} className="hover:bg-zinc-100">
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs"></span>
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-zinc-600">{user.email}</span>
                  <span className="text-sm text-zinc-600">{user.role}</span>
                </div>
              </TableCell>

              <TableCell>
                $
                {user.orders.reduce(
                  (acc, order) => acc + Number(order.total),
                  0
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedUser(user.id)}
                  >
                    View
                  </Button>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectDeleteUser(user.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedUser && (
        <AdminUserOrderDetails
          setSelectedUser={setSelectedUser}
          id={selectedUser}
        />
      )}
      {totalUsers > perPage && (
        <PaginationGeneric total={totalUsers} skip={skip} setSkip={setSkip} />
      )}

      {selectDeleteUser && (
        <AlertDialog
          open={selectDeleteUser !== ""}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectDeleteUser("");
            else setSelectDeleteUser("");
          }}
        >
          <AlertDialogContent>
            <AlertDialogTitle className="font-bold text-lg">
              Are you sure you want to delete this user{" "}
              {data && data.find((user) => user.id === selectDeleteUser)?.name}?
            </AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={async () => {
                  const res = await deleteUserAdmin(selectDeleteUser);
                  if (res?.success) {
                    setData((prev) =>
                      prev.filter((user) => user.id !== selectDeleteUser)
                    );
                    setSelectDeleteUser("");
                  }
                }}
              >
                Delete
              </AlertDialogAction>
              <Button variant="outline" onClick={() => setSelectDeleteUser("")}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
