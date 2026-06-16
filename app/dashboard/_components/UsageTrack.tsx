"use client"
import React, { useContext, useEffect, useState } from 'react'
import { db } from '@/app/utils/db'
import { AIOutput } from '@/app/utils/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Zap } from 'lucide-react'

function UsageTrack() {
  const { user } = useUser()
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      GetData()
      checkPlan()
    }
  }, [user])

  // Monitor updates to plan changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      checkPlan()
    }
    window.addEventListener('storage', handleStorageChange)
    // Custom event listener for same-window updates
    window.addEventListener('planUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('planUpdated', handleStorageChange)
    }
  }, [])

  const checkPlan = () => {
    const plan = localStorage.getItem('user_plan')
    setIsPremium(plan === 'premium')
  }

  const GetData = async () => {
    try {
      setLoading(true)
      const email = user?.primaryEmailAddress?.emailAddress
      if (!email) return

      const result = await db
        .select()
        .from(AIOutput)
        .where(eq(AIOutput.createdBy, email))

      let totalWords = 0
      result.forEach((item) => {
        if (item.aiResponse) {
          totalWords += item.aiResponse.split(/\s+/).filter((w) => w.length > 0).length
        }
      })

      setTotalUsage(totalWords)
    } catch (error) {
      console.error('Error calculating usage:', error)
    } finally {
      setLoading(false)
    }
  }

  const limit = 10000
  const percentage = Math.min((totalUsage / limit) * 100, 100)

  return (
    <div className="mx-2 my-4">
      <div className="bg-primary text-white p-5 rounded-2xl shadow-md border border-primary/10 relative overflow-hidden">
        {/* Background Decorative Gradient Orb */}
        <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        
        {isPremium ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 fill-yellow-300 text-yellow-300 animate-pulse" />
              <h2 className="font-bold text-lg">Premium Plan</h2>
            </div>
            <p className="text-xs text-primary-foreground/85 leading-relaxed">
              You have unlimited access to AI Content Generation!
            </p>
            <div className="mt-4 text-xs font-semibold text-white/90 bg-white/20 py-1.5 px-3 rounded-lg text-center">
              Active Status: Lifetime/Monthly
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-bold text-sm">Credits Usage</h2>
            <div className="w-full bg-primary-foreground/20 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-primary-foreground/80 mt-2 font-medium">
              {loading ? 'Calculating...' : `${totalUsage} / ${limit} words used`}
            </p>
            <Link href="/dashboard/billing">
              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-4 bg-white text-primary hover:bg-white/95 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
              >
                <Zap className="h-3.5 w-3.5 fill-primary text-primary" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsageTrack
