import { useState, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  AlignLeft,
  Link as LinkIcon,
  Image,
  FileText,
  Check,
  Loader2,
  Home,
  User,
  Settings,
  Search
} from 'lucide-react'
import './style-guide.css'
import designGuidelines from './planning/design-guidelines.json'

export default function StyleGuide() {
  const [attachmentState, setAttachmentState] = useState<'loading' | 'success'>('loading')
  const guidelines = designGuidelines

  useEffect(() => {
    // Simulate attachment loading
    const timer = setTimeout(() => {
      setAttachmentState('success')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="style-guide-container">
      <div className="style-guide-content">
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="style-guide-h1" style={{ marginBottom: '0.5rem' }}>
            {guidelines.meta.projectName} Design System
          </h1>
          <p className="style-guide-body" style={{ color: '#6B7280', fontSize: '1.125rem' }}>
            {guidelines.meta.aesthetic}
          </p>
          <p className="style-guide-caption" style={{ marginTop: '0.5rem' }}>
            Version {guidelines.meta.version}
          </p>
        </div>

        {/* Typography Section */}
        <section className="style-guide-section">
          <h2 className="style-guide-section-title">Typography</h2>
          
          <div className="demo-container">
            <div className="style-guide-subsection">
              <h3 className="style-guide-subsection-title">Display Font - Playfair Display</h3>
              <div style={{ marginBottom: '2rem' }}>
                <h1 className="style-guide-h1">Heading 1 - 2.5rem / 700</h1>
                <h2 className="style-guide-h2">Heading 2 - 2rem / 600</h2>
                <h3 className="style-guide-h3">Heading 3 - 1.5rem / 600</h3>
              </div>
            </div>

            <div className="style-guide-subsection">
              <h3 className="style-guide-subsection-title">UI Font - Inter</h3>
              <p className="style-guide-body">
                Body text - 1rem / 400. This is the primary font for all UI elements, 
                paragraphs, and interface text. It provides excellent readability at 
                all sizes and maintains clarity across different screen sizes.
              </p>
              <p className="style-guide-caption" style={{ marginTop: '1rem' }}>
                Caption text - 0.875rem / 400. Used for secondary information, 
                labels, and helper text.
              </p>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="style-guide-section">
          <h2 className="style-guide-section-title">Color Palette</h2>
          
          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Background Colors</h3>
            <div className="color-swatch-grid">
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.background.app }}
                />
                <div className="color-swatch-label">App Background</div>
                <div className="color-swatch-value">{guidelines.colors.background.app}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.background.surface }}
                />
                <div className="color-swatch-label">Surface</div>
                <div className="color-swatch-value">{guidelines.colors.background.surface}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.background.surfaceHighlight }}
                />
                <div className="color-swatch-label">Surface Highlight</div>
                <div className="color-swatch-value">{guidelines.colors.background.surfaceHighlight}</div>
              </div>
            </div>
          </div>

          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Text Colors</h3>
            <div className="color-swatch-grid">
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.text.primary }}
                />
                <div className="color-swatch-label">Primary</div>
                <div className="color-swatch-value">{guidelines.colors.text.primary}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.text.secondary }}
                />
                <div className="color-swatch-label">Secondary</div>
                <div className="color-swatch-value">{guidelines.colors.text.secondary}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.text.tertiary }}
                />
                <div className="color-swatch-label">Tertiary</div>
                <div className="color-swatch-value">{guidelines.colors.text.tertiary}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.text.inverse }}
                />
                <div className="color-swatch-label">Inverse</div>
                <div className="color-swatch-value">{guidelines.colors.text.inverse}</div>
              </div>
            </div>
          </div>

          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Action Colors</h3>
            <div className="color-swatch-grid">
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.action.primary }}
                />
                <div className="color-swatch-label">Primary</div>
                <div className="color-swatch-value">{guidelines.colors.action.primary}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.action.primaryHover }}
                />
                <div className="color-swatch-label">Primary Hover</div>
                <div className="color-swatch-value">{guidelines.colors.action.primaryHover}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.action.accent }}
                />
                <div className="color-swatch-label">Accent</div>
                <div className="color-swatch-value">{guidelines.colors.action.accent}</div>
              </div>
            </div>
          </div>

          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Border Colors</h3>
            <div className="color-swatch-grid">
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.border.subtle }}
                />
                <div className="color-swatch-label">Subtle</div>
                <div className="color-swatch-value">{guidelines.colors.border.subtle}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.border.focus }}
                />
                <div className="color-swatch-label">Focus</div>
                <div className="color-swatch-value">{guidelines.colors.border.focus}</div>
              </div>
            </div>
          </div>

          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Feedback Colors</h3>
            <div className="color-swatch-grid">
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.feedback.success }}
                />
                <div className="color-swatch-label">Success</div>
                <div className="color-swatch-value">{guidelines.colors.feedback.success}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.feedback.warning }}
                />
                <div className="color-swatch-label">Warning</div>
                <div className="color-swatch-value">{guidelines.colors.feedback.warning}</div>
              </div>
              <div className="color-swatch">
                <div 
                  className="color-swatch-preview" 
                  style={{ backgroundColor: guidelines.colors.feedback.error }}
                />
                <div className="color-swatch-label">Error</div>
                <div className="color-swatch-value">{guidelines.colors.feedback.error}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Shadows & Depth Section */}
        <section className="style-guide-section">
          <h2 className="style-guide-section-title">Shadows & Depth</h2>
          
          <div className="shadow-demo-grid">
            <div 
              className="shadow-demo-card"
              style={{ boxShadow: guidelines.ui_components.shadows.soft }}
            >
              <div style={{ 
                width: '100px', 
                height: '100px', 
                margin: '0 auto',
                backgroundColor: '#F3F4F6',
                borderRadius: '12px'
              }} />
              <div className="shadow-demo-label">Soft Shadow</div>
            </div>
            
            <div 
              className="shadow-demo-card"
              style={{ boxShadow: guidelines.ui_components.shadows.medium }}
            >
              <div style={{ 
                width: '100px', 
                height: '100px', 
                margin: '0 auto',
                backgroundColor: '#F3F4F6',
                borderRadius: '12px'
              }} />
              <div className="shadow-demo-label">Medium Shadow</div>
            </div>
            
            <div 
              className="shadow-demo-card"
              style={{ boxShadow: guidelines.ui_components.shadows.floating }}
            >
              <div style={{ 
                width: '100px', 
                height: '100px', 
                margin: '0 auto',
                backgroundColor: '#F3F4F6',
                borderRadius: '12px'
              }} />
              <div className="shadow-demo-label">Floating Shadow</div>
            </div>
          </div>
        </section>

        {/* UI Components Section */}
        <section className="style-guide-section">
          <h2 className="style-guide-section-title">UI Components</h2>

          {/* Editor Toolbar */}
          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Editor Toolbar</h3>
            <div className="demo-container">
              <div className="editor-toolbar">
                <button 
                  className="toolbar-button toolbar-button-active"
                  style={{
                    backgroundColor: guidelines.component_specs.buttons.active_tool.bg,
                    color: guidelines.component_specs.buttons.active_tool.text,
                    boxShadow: guidelines.component_specs.buttons.active_tool.shadow,
                    transform: guidelines.component_specs.buttons.active_tool.transform
                  }}
                >
                  <Bold size={18} />
                </button>
                <button className="toolbar-button">
                  <Italic size={18} />
                </button>
                <button className="toolbar-button">
                  <Underline size={18} />
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#E5E7EB', margin: '0 0.25rem' }} />
                <button className="toolbar-button">
                  <List size={18} />
                </button>
                <button className="toolbar-button">
                  <AlignLeft size={18} />
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#E5E7EB', margin: '0 0.25rem' }} />
                <button className="toolbar-button">
                  <LinkIcon size={18} />
                </button>
                <button className="toolbar-button">
                  <Image size={18} />
                </button>
              </div>
              <p className="style-guide-caption" style={{ marginTop: '1rem' }}>
                Bold button shows active state with white background, shadow, and slight elevation.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Bottom Bar</h3>
            <div className="demo-container" style={{ position: 'relative', minHeight: '200px' }}>
              <div 
                className="bottom-bar"
                style={{
                  position: 'relative',
                  transform: 'none',
                  left: 'auto',
                  bottom: 'auto',
                  margin: '2rem auto 0'
                }}
              >
                <Home size={20} className="bottom-bar-icon" />
                <Search size={20} className="bottom-bar-icon" />
                <FileText size={20} className="bottom-bar-icon" />
                <User size={20} className="bottom-bar-icon" />
                <Settings size={20} className="bottom-bar-icon" />
              </div>
              <p className="style-guide-caption" style={{ marginTop: '1rem' }}>
                Dark pill-shaped floating bar with placeholder icons.
              </p>
            </div>
          </div>

          {/* Mentions */}
          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Mentions</h3>
            <div className="demo-container">
              <div className="mentions-input-container">
                <span 
                  className="mention-tag"
                  style={{
                    backgroundColor: guidelines.component_specs.tags.mention.bg,
                    color: guidelines.component_specs.tags.mention.text,
                    borderRadius: guidelines.component_specs.tags.mention.radius,
                    padding: guidelines.component_specs.tags.mention.padding
                  }}
                >
                  @username
                </span>
                <input 
                  type="text" 
                  className="mentions-input" 
                  placeholder="Type a message..."
                />
              </div>
              <p className="style-guide-caption" style={{ marginTop: '1rem' }}>
                Text input with @mention tag styled according to specs.
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="style-guide-subsection">
            <h3 className="style-guide-subsection-title">Attachments</h3>
            <div className="demo-container">
              <div className="attachment-card">
                <div className="attachment-icon">
                  <FileText size={20} color="#6B7280" />
                </div>
                <div className="attachment-info">
                  <div className="attachment-name">document.pdf</div>
                  <div className="attachment-size">2.4 MB</div>
                </div>
                <div className="attachment-status">
                  {attachmentState === 'loading' ? (
                    <Loader2 size={20} className="spinner" />
                  ) : (
                    <Check size={20} className="success-icon" />
                  )}
                </div>
              </div>
              <p className="style-guide-caption" style={{ marginTop: '1rem' }}>
                Attachment card showing {attachmentState === 'loading' ? 'loading spinner' : 'success state'}.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div style={{ 
          marginTop: '4rem', 
          paddingTop: '2rem', 
          borderTop: '2px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <p className="style-guide-caption">
            Design System v{guidelines.meta.version} • {guidelines.meta.aesthetic}
          </p>
        </div>
      </div>
    </div>
  )
}
