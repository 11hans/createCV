import { Resend } from 'resend'
import { languageService } from '~/language/service'

export default defineEventHandler(async (event) => {
  const host = event.node.req.headers.host || ''
  const config = useRuntimeConfig()
  
  // Check if API key is configured
  if (!config.resendApiKey) {
    console.error('Resend API key is not configured in runtime config')
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service is not properly configured (missing API key)',
    })
  }

  const resend = new Resend(config.resendApiKey)

  try {
    const body = await readBody(event)
    
    // Log the raw request body for debugging
    console.log('Raw request body:', body)
    
    // Validate that body exists and is an object
    if (!body || typeof body !== 'object') {
      console.error('Invalid request body:', body)
      throw createError({
        statusCode: 400,
        statusMessage: 'Request body is missing or invalid',
      })
    }

    // Destructure and validate required fields
    const {
      firstName,
      lastName,
      email,
      company,
      message
    } = body as {
      firstName?: string
      lastName?: string
      email?: string
      company?: string
      message?: string
    }

    // Validate required fields
    const missingFields: string[] = []
    if (!firstName || !firstName.trim()) missingFields.push('firstName')
    if (!lastName || !lastName.trim()) missingFields.push('lastName')
    if (!email || !email.trim()) missingFields.push('email')
    if (!message || !message.trim()) missingFields.push('message')
    
    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`
      console.error('Validation error:', errorMessage)
      throw createError({
        statusCode: 400,
        statusMessage: errorMessage,
      })
    }

    // At this point, we know all required fields exist and are not empty
    const sanitizedFirstName = firstName!.trim()
    const sanitizedLastName = lastName!.trim()
    const sanitizedEmail = email!.trim().toLowerCase()
    const sanitizedCompany = company?.trim() || ''
    const sanitizedMessage = message!.trim()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      console.error('Invalid email format:', sanitizedEmail)
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
      })
    }

    console.log('Attempting to send email with Resend...')

    // Determine the display name based on the current domain
    const currentLocale = languageService.detectLocale(host)
    const displayDomain = host.endsWith('.cz') ? 'qfast.cz' : 'qfast.co'
    const displayName = currentLocale === 'cs' ? 'QFast CZ' : 'QFast'

    const emailHtml = `
      <div style="font-family: sans-serif;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p style="margin-bottom: 8px;"><strong>Name:</strong> ${sanitizedFirstName} ${sanitizedLastName}</p>
        <p style="margin-bottom: 8px;"><strong>Email:</strong> ${sanitizedEmail}</p>
        ${sanitizedCompany ? `<p style="margin-bottom: 8px;"><strong>Company:</strong> ${sanitizedCompany}</p>` : ''}
        <p style="margin-bottom: 8px;"><strong>Message:</strong></p>
        <p style="margin-bottom: 8px;">${sanitizedMessage}</p>
        <p style="font-size: 0.8em; color: #777;">Submitted from: ${displayDomain}</p>
      </div>
    `

    try {
      const { data, error } = await resend.emails.send({
        from: `${displayName} <contact@qfast.co>`,
        to: ['honza.ves@email.cz'],
        subject: `New Contact Form Submission from ${sanitizedFirstName} ${sanitizedLastName}`,
        html: emailHtml,
        replyTo: sanitizedEmail,
        headers: {
          'From': `${displayName} <contact@${displayDomain}>`,
        }
      })

      if (error) {
        console.error('Resend API Error:', error)
        throw createError({
          statusCode: 500,
          statusMessage: error.message || 'Failed to send email',
        })
      }

      console.log('Email sent successfully:', data)

      return {
        success: true,
        message: 'Email sent successfully',
        data: {
          id: data?.id,
          to: ['honza.ves@email.cz']
        }
      }
    } catch (sendError: any) {
      console.error('Resend send error:', sendError)
      throw createError({
        statusCode: 500,
        statusMessage: sendError.message || 'Failed to send email',
      })
    }
  } catch (error: any) {
    console.error('Contact Form Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to process the request',
    })
  }
})