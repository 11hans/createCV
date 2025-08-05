import { defineEventHandler } from 'h3'
import fs from 'fs'
import path from 'path'

// Define the subscription data interface
interface SubscriptionData {
  email: string;
  subscription_date: string;
  [key: string]: any; // Allow for other properties
}

export default defineEventHandler(async () => {
  try {
    // Check if logs directory exists
    const logDir = path.resolve(process.cwd(), 'logs')
    const logFile = path.join(logDir, 'newsletter-subscriptions.json')
    
    if (!fs.existsSync(logDir) || !fs.existsSync(logFile)) {
      return {
        success: true,
        message: 'No subscriptions found',
        subscriptions: {
          count: 0,
          last: []
        }
      }
    }
    
    // Read the log file
    const fileContent = fs.readFileSync(logFile, 'utf-8')
    const subscriptions: SubscriptionData[] = JSON.parse(fileContent)
    
    // Get the last 5 subscriptions
    const lastSubscriptions = subscriptions
      .slice(-5)
      .map((sub: SubscriptionData) => ({
        email: sub.email,
        date: sub.subscription_date,
        source: sub.source || 'unknown'
      }))
    
    return {
      success: true,
      message: `Found ${subscriptions.length} subscriptions`,
      subscriptions: {
        count: subscriptions.length,
        last: lastSubscriptions
      }
    }
  } catch (error: any) {
    logError('Error in test-newsletter endpoint:', error)
    return {
      success: false,
      message: `Error: ${error.message}`,
      error: error.message
    }
  }
}) 