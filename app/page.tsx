import Image from "next/image";
import Link from "next/link";
import SignUp from "./components/SigningUp/SigningUp/SignUp"; 
import bar from "./components/Navigation/bar";

export default function Home() {
  return (
    <main>
      {/* <Link href={"/users"}>
        Users
      </Link> */}
      <SignUp /> 
      <bar />
    </main>
  );
}
