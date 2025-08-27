import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

export default function CategorySubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Add Category"}
    </Button>
  );
}
