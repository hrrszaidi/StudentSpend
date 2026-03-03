import Hero from "@/components/LandingPage/Hero"
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Footer from "@/components/LandingPage/Footer"
export default function Home() {
  return (
    <>
        <Navbar/>
        <Hero />
        <Footer />
    </>
  )
}
