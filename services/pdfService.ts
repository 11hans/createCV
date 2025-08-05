let html2canvas: any
let jsPDF: any

// Replace top-level await with a function that loads modules
const loadModules = async (): Promise<void> => {
  if (process.client) {
    const html2canvasModule = await import('html2canvas-pro')
    const jspdfModule = await import('jspdf')
    html2canvas = html2canvasModule.default
    jsPDF = jspdfModule.default
  }
}

type PDFUnit = 'px' | 'pt' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc'
interface PDFOptions {
  format: string | [number, number]
  unit: PDFUnit
  orientation?: 'p' | 'portrait' | 'l' | 'landscape'
}

export const generatePDF = async (elementId: string): Promise<string> => {
  try {
    // Ensure modules are loaded before using them
    if (!html2canvas || !jsPDF) {
      await loadModules()
    }

    const element = document.getElementById(elementId)
    if (!element) throw new Error('Element not found')

    // A4 dimensions in points (pt)
    const a4Width = 595.28
    const a4Height = 841.89
    
    // Define padding (in points)
    const padding = 40 // You can adjust this value to increase/decrease padding

    // Available width/height after padding
    const availableWidth = a4Width - (padding * 2)
    const availableHeight = a4Height - (padding * 2)

    // Create canvas with better quality settings
    const canvas = await html2canvas(element, {
      scale: 2, // Better quality for retina displays
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight
    })

    // Initialize PDF document with pt units
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'pt' as PDFUnit,
      orientation: 'portrait'
    })

    // Calculate scaling to fit the PDF page (accounting for padding)
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    // Calculate scale to fit width (with padding)
    const scale = availableWidth / canvasWidth
    const scaledHeight = canvasHeight * scale

    // Add image to PDF with calculated dimensions and padding
    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      padding, // x position with padding
      padding, // y position with padding
      availableWidth, // width minus padding
      scaledHeight, // height scaled proportionally
      undefined,
      'FAST'
    )

    // Generate blob URL for download
    const pdfBlob = pdf.output('blob')
    return URL.createObjectURL(pdfBlob)
  } catch (error) {
    logError('PDF generation failed:', error)
    throw error
  }
}