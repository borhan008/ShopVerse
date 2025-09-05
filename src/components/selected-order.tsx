import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderContext } from "@/context/order-context";
import { useState } from "react";
import { Form } from "./ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/app/actions/actions";
import { toast } from "sonner";
import { TOrder } from "@/types/types";
import { OrderStatus } from "@/generated/prisma";
export default function SelectedOrder() {
  const [open, setOpen] = useState(true);
  const { setSelectedOrder, selectedOrder, orders, setOrders } =
    useOrderContext();
  if (!selectedOrder) return;
  const setOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedOrder(null);
    }
    setOpen(isOpen);
  };
  return (
    <Dialog open={open} onOpenChange={setOpenChange}>
      <DialogContent className="w-full min-w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Order #{selectedOrder.id}
          </DialogTitle>
          <DialogDescription>
            {new Date(selectedOrder.createdAt).toLocaleString("em-US", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row w-full justify-between">
          <div>
            <h2>{selectedOrder.user.name}</h2>
            <h3>{selectedOrder.user.email}</h3>
          </div>

          <div>
            <h2 className="font-semibold">Shipping Address</h2>
            <p>{selectedOrder.address}</p>
          </div>
        </div>

        <div>
          <Table>
            <TableHeader className="bg-zinc-200 ">
              <TableRow>
                <TableHead className="">Product</TableHead>
                <TableHead className="">Quantity</TableHead>
                <TableHead className="">Cost</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {selectedOrder.items.map((item) => (
                <TableRow key={item.id.toString()}>
                  <TableCell className="font-medium flex gap-2 items-center ">
                    <img
                      src={`${process.env.NEXT_PUBLIC_GATEWAY}/${item.product.image}`}
                      alt={item.product.name}
                      width={50}
                      className="max-h-[50px] object-cover"
                    />
                    <p>
                      {item.product.name} <br /> ${item.price}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium">{item.quantity}</TableCell>
                  <TableCell className="font-medium">
                    ${item.price * item.quantity}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-zinc-200">
                <TableCell colSpan={2} className="text-right font-bold">
                  Total:
                </TableCell>
                <TableCell className="font-bold">
                  ${selectedOrder.total}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <p className="text-medium mb-2 mt-8 font-semibold">
            Change the delivery of this order status:
          </p>
          <form
            className="flex flex-row items-center gap-4"
            action={async (data: FormData) => {
              const status = data.get("status") as string;
              const res = await updateOrderStatus(selectedOrder.id, status);
              if (res.success) {
                toast.success("Order status updated successfully");
                setOrders((prevOrders: TOrder[] | null) =>
                  prevOrders
                    ? prevOrders.map((o) =>
                        o.id === selectedOrder.id
                          ? { ...o, status: status as OrderStatus }
                          : o
                      )
                    : null
                );

                setSelectedOrder(null);
              } else {
                toast.error(status || res.message || "Something went wrong");
              }
            }}
          >
            <Select
              value={selectedOrder.status}
              onValueChange={(val) =>
                setSelectedOrder({
                  ...selectedOrder,
                  status: val as OrderStatus,
                })
              }
              name="status"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Select Order Status"
                  defaultValue={selectedOrder.status}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">Update Status</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
