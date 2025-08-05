import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  // Set headers
  setResponseHeaders(event, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept'
  })
  
  // Handle preflight
  if (event.node.req.method === 'OPTIONS') {
    return { success: true }
  }
  
  // Simple body handling
  let body = null
  
  try {
    // Get raw request body
    const chunks = []
    for await (const chunk of event.node.req) {
      chunks.push(chunk)
    }
    
    if (chunks.length > 0) {
      const rawBody = Buffer.concat(chunks).toString('utf-8')
      
      // Try to parse if there's content
      if (rawBody && rawBody.length > 0) {
        try {
          body = JSON.parse(rawBody)
        } catch (e) {
          logError('JSON parse error:', e)
          return {
            success: false,
            message: 'Invalid JSON format'
          }
        }
      }
    }
    
    // Check for body
    if (!body) {
      return {
        success: false,
        message: 'No data received'
      }
    }
    
    // Test request handling
    if (body.test === true) {
      return {
        success: true,
        message: 'Test request successful',
        received: body
      }
    }
    
    // Extract form data
    const { firstName, lastName, email, company, message } = body
    
    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      const missing = []
      if (!firstName) missing.push('firstName')
      if (!lastName) missing.push('lastName')
      if (!email) missing.push('email')
      if (!message) missing.push('message')
      
      return {
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      }
    }
    
    // Get API key from runtime config
    const config = useRuntimeConfig()
    const resendApiKey = config.resendApiKey
    
    if (!resendApiKey) {
      logError('Resend API key is missing')
      return {
        success: false,
        message: 'Email service configuration error'
      }
    }
    
    // Create HTML email content
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <div style="margin-top: 20px;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          Sent from the QFast contact form
        </p>
      </div>
    `
    
    // Create Resend client
    const resend = new Resend(resendApiKey)
    
    // Send email
    const { data, error: resendError } = await resend.emails.send({
      from: 'QFast Contact Form <no-reply@qfast.co>',
      to: ['hi@qfast.co'],
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html,
      replyTo: email
    });
    
    
    if (resendError) {
      logError('Resend API Error:', resendError)
      return {
        success: false,
        message: 'Failed to send email',
        error: resendError
      }
    }
    
    return {
      success: true,
      message: 'Your message has been sent successfully',
      emailId: data?.id
    }
    
  } catch (error) {
    logError('Contact form error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: String(error)
    }
  }
}) 