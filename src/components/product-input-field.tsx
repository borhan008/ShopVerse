import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

type GenericFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  type?: string;
};

export function GenericField<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  type = "text",
}: GenericFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
  );
}
