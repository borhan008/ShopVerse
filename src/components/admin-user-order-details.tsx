import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchUserOrderAdmin } from "@/app/actions/actions";
import { TOrder } from "@/types/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
} from "./ui/table";

type TAdminUserOrderDetailsProps = {
  id: string;
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
};

export default function AdminUserOrderDetails({
  id,
  setSelectedUser,
}: TAdminUserOrderDetailsProps) {
  const [open, setOpen] = useState(true);
  const [selectedUserOrders, setSelectedUserOrders] = useState<
    Omit<TOrder, "user">[]
  >([]);
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedUser(null);
      setOpen(false);
    } else setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchUserOrderAdmin(id);
      console.log(res);

      if (res.data) {
        setSelectedUserOrders(res.data);
      }
    };
    fetchData();
  }, [id]);
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="overflow-y-auto max-h-[calc(100%_-_2rem)]">
        <DialogHeader>
          <DialogTitle>Order Histroy</DialogTitle>
        </DialogHeader>

        <div>
          {selectedUserOrders.map((order, idx) => (
            <div key={idx}>
              <Table className="w-full my-8">
                <TableCaption>
                  Order #{order.id} -{" "}
                  {new Date(order.createdAt).toLocaleString("em-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </TableCaption>
                <TableHeader className="border-b bg-zinc-200">
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>${item.price * item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-zinc-200">
                    <TableCell colSpan={4} className="text-right font-bold">
                      Grand Total
                    </TableCell>
                    <TableCell className="font-bold">${order.total}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
