import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Converts HTML content to DOCX format and triggers download
 */
export async function exportToDocx(content: string, title: string): Promise<void> {
  try {
    // Parse HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const body = doc.body

    const docxChildren: (Paragraph | Paragraph[])[] = []

    // Add title as heading
    if (title) {
      docxChildren.push(
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        })
      )
    }

    // Process all child nodes
    const processNode = (node: Node): (Paragraph | Paragraph[])[] => {
      const result: (Paragraph | Paragraph[])[] = []

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim()
        if (text) {
          result.push(
            new Paragraph({
              children: [new TextRun(text)],
            })
          )
        }
        return result
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return result
      }

      const element = node as Element
      const tagName = element.tagName.toLowerCase()

      // Process headings
      if (tagName === 'h1') {
        result.push(
          new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          })
        )
      } else if (tagName === 'h2') {
        result.push(
          new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          })
        )
      } else if (tagName === 'h3') {
        result.push(
          new Paragraph({
            text: element.textContent || '',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          })
        )
      }
      // Process paragraphs
      else if (tagName === 'p') {
        const paragraph = processInlineContent(element)
        if (paragraph.children.length > 0) {
          result.push(paragraph)
        }
      }
      // Process blockquotes
      else if (tagName === 'blockquote') {
        const inlineContent = processInlineContent(element)
        if (inlineContent.children.length > 0) {
          result.push(
            new Paragraph({
              children: inlineContent.children,
              indent: { left: 720 }, // 0.5 inch indent
            })
          )
        }
      }
      // Process lists
      else if (tagName === 'ul') {
        const listItems = Array.from(element.querySelectorAll('li'))
        listItems.forEach((li) => {
          const inlineContent = processInlineContent(li)
          if (inlineContent.children.length > 0) {
            result.push(
              new Paragraph({
                children: inlineContent.children,
                bullet: { level: 0 },
              })
            )
          }
        })
      } else if (tagName === 'ol') {
        // For ordered lists, use bullet points (simplified for V1)
        // Could be enhanced later with proper numbering
        const listItems = Array.from(element.querySelectorAll('li'))
        listItems.forEach((li) => {
          const inlineContent = processInlineContent(li)
          if (inlineContent.children.length > 0) {
            result.push(
              new Paragraph({
                children: inlineContent.children,
                bullet: { level: 0 },
              })
            )
          }
        })
      }
      // Process list items (handled by parent ul/ol)
      else if (tagName === 'li') {
        // Skip, handled by parent
      }
      // Process other elements recursively
      else {
        Array.from(element.childNodes).forEach((child) => {
          result.push(...processNode(child))
        })
      }

      return result
    }

    // Process inline content (bold, italic, underline, strikethrough)
    const processInlineContent = (element: Element): Paragraph => {
      const children: TextRun[] = []
      let currentText = ''
      let currentBold = false
      let currentItalic = false
      let currentUnderline = false
      let currentStrike = false

      const flushText = () => {
        if (currentText.trim()) {
          children.push(
            new TextRun({
              text: currentText,
              bold: currentBold,
              italics: currentItalic,
              underline: currentUnderline ? {} : undefined,
              strike: currentStrike,
            })
          )
          currentText = ''
        }
      }

      const processElement = (el: Node) => {
        if (el.nodeType === Node.TEXT_NODE) {
          currentText += el.textContent || ''
          return
        }

        if (el.nodeType !== Node.ELEMENT_NODE) {
          return
        }

        const elem = el as Element
        const tag = elem.tagName.toLowerCase()

        // Flush current text before changing style
        flushText()

        // Set style flags
        const wasBold = currentBold
        const wasItalic = currentItalic
        const wasUnderline = currentUnderline
        const wasStrike = currentStrike

        if (tag === 'strong' || tag === 'b') {
          currentBold = true
        } else if (tag === 'em' || tag === 'i') {
          currentItalic = true
        } else if (tag === 'u') {
          currentUnderline = true
        } else if (tag === 's' || tag === 'strike') {
          currentStrike = true
        }

        // Process children
        Array.from(elem.childNodes).forEach(processElement)

        // Restore style flags
        flushText()
        currentBold = wasBold
        currentItalic = wasItalic
        currentUnderline = wasUnderline
        currentStrike = wasStrike
      }

      Array.from(element.childNodes).forEach(processElement)
      flushText()

      // If no children, use text content
      if (children.length === 0 && element.textContent?.trim()) {
        children.push(new TextRun(element.textContent.trim()))
      }

      return new Paragraph({
        children,
      })
    }

    // Process all nodes in body
    Array.from(body.childNodes).forEach((node) => {
      docxChildren.push(...processNode(node))
    })

    // If no content, add empty paragraph
    if (docxChildren.length === 0) {
      docxChildren.push(new Paragraph({ text: '' }))
    }

    // Create DOCX document
    const docxDocument = new Document({
      sections: [
        {
          children: docxChildren.flat(),
        },
      ],
    })

    // Generate blob and download
    const blob = await Packer.toBlob(docxDocument)
    const fileName = title ? `${title}.docx` : 'document.docx'
    saveAs(blob, fileName)
  } catch (error) {
    console.error('Error exporting to DOCX:', error)
    throw new Error('Failed to export document as DOCX')
  }
}

/**
 * Converts HTML content to PDF format and triggers download
 */
export async function exportToPdf(content: string, title: string): Promise<void> {
  try {
    // Create a temporary container to render the HTML
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.width = '816px' // A4 width in pixels at 96 DPI
    container.style.padding = '40px'
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif'
    container.style.fontSize = '14px'
    container.style.lineHeight = '1.6'
    container.style.color = '#1a1a1a'
    container.style.backgroundColor = '#ffffff'

    // Add title if provided
    if (title) {
      const titleElement = document.createElement('h1')
      titleElement.textContent = title
      titleElement.style.fontSize = '24px'
      titleElement.style.fontWeight = 'bold'
      titleElement.style.marginBottom = '20px'
      titleElement.style.marginTop = '0'
      container.appendChild(titleElement)
    }

    // Add content
    const contentDiv = document.createElement('div')
    contentDiv.innerHTML = content
    container.appendChild(contentDiv)

    // Style the content to match editor
    const style = document.createElement('style')
    style.textContent = `
      h1 { font-size: 24px; font-weight: bold; margin: 16px 0 8px 0; }
      h2 { font-size: 20px; font-weight: bold; margin: 14px 0 6px 0; }
      h3 { font-size: 18px; font-weight: bold; margin: 12px 0 4px 0; }
      p { margin: 8px 0; }
      ul, ol { margin: 8px 0; padding-left: 24px; }
      li { margin: 4px 0; }
      blockquote { margin: 8px 0; padding-left: 16px; border-left: 3px solid #ccc; }
      strong, b { font-weight: bold; }
      em, i { font-style: italic; }
      u { text-decoration: underline; }
      s, strike { text-decoration: line-through; }
    `
    container.appendChild(style)

    document.body.appendChild(container)

    // Render to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    // Remove temporary container
    document.body.removeChild(container)

    // Calculate PDF dimensions
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const pdfWidth = 210 // A4 width in mm
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth
    const pageHeight = 297 // A4 height in mm

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    let heightLeft = pdfHeight
    let position = 0

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, pdfHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pageHeight
    }

    // Download PDF
    const fileName = title ? `${title}.pdf` : 'document.pdf'
    pdf.save(fileName)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw new Error('Failed to export document as PDF')
  }
}
