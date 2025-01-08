import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import Placeholder from './placeholder.svg'
export default function Home() {
  return (
    <div className="flex flex-col w-full mx-auto container">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Peerawat Khowticha
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Frontend & Backend Developer
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-4">
              <div className="flex justify-center">
                
                <Image
                  src={Placeholder}
                  alt="Profile"
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-gray-100 dark:border-gray-800"
                  priority
                />
              </div>
            </div>
            <div className="space-x-4">
              <Link href="/projects">
                <Button>View Projects</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">Contact Me</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Gradient */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Me
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                I&apos;m a passionate developer with expertise in React, Next.js, and modern web technologies. 
                I create beautiful, functional, and user-friendly applications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

