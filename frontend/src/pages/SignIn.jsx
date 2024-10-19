import OAuth from "../components/OAuth";

export default function SignIn() {
  return (
    <div className="p-3 max-w-lg mx-auto h-screen flex flex-col justify-center items-center">
      <div className="border-2 border-gray-400 rounded-md p-5">
        <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
        <div className="mx-auto">
          <OAuth />
        </div>
      </div>
    </div>
  );
}
