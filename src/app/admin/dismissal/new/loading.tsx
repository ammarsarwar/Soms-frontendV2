import { Icons } from "@/components/ui/icons";

function loading() {
  return (
    <div className="flex gap-5 w-full h-screen justify-center items-center">
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      <p>loading dismissal form</p>
    </div>
  );
}

export default loading;
