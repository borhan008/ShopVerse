import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center flex flex-wrap flex-col md:flex-row items-center  justify-center mx-auto min-h-screen   mx-auto  gap-4">
      <div className="flex-1 px-5 py-10 font-semibold   my-0 bg-linear-to-t  from-sky-500 to-indigo-500 min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-white  text-4xl ">Shop in more faster way</h2>
        <p className="text-md text-white/80 font-light">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quod.
        </p>
        <Image
          src="/shop-login.png"
          alt="Shop Login"
          width={100}
          height={100}
          className="mb-4 mx-auto mt-7 w-full h-auto max-w-sm"
        />
      </div>
      <div className="flex-1 py-4 px-2 max-w-[500px] flex items-center flex-col justify-center min-w-[300px] w-full ">
        <Image
          src="next.svg"
          alt="Logo"
          width={50}
          height={50}
          className="mb-4"
        />
        {children}
      </div>
    </div>
  );
}
