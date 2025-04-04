import { SignUp } from '@clerk/nextjs'
import { div } from 'motion/react-client';
import { dark } from '@clerk/themes';

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp
      appearance={{
        baseTheme: dark,
     }}
       />
    </div>
  );

}