import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

// export default function Home() {
//   return (
//   <div>
//     <h2>Sparshi</h2>
//     <Button>Subscribe</Button>
//   </div>
//   );
// }
// app/page.tsx (for Next.js 13+ with App Router)
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          <span className="text-blue-600">TextGenie</span> — Your AI-Powered Content Assistant
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Generate high-quality content for Blogs, YouTube, Instagram & more in seconds.
          Powered by AI. Personalized for you.
        </p>
        <div className="flex justify-center gap-4">
            <Button asChild>
         <Link href="/sign-in?redirect_url=/dashboard">Get Started</Link>
      </Button>
         


        
        </div>
      </div>

      <div className="mt-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-4">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Blog Titles", desc: "Generate engaging blog headlines instantly." },
            { title: "YouTube SEO", desc: "Craft click-worthy YouTube titles." },
            { title: "LinkedIn Posts", desc: "Create impactful professional content." }
          ].map(({ title, desc }) => (
            <div key={title} className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

