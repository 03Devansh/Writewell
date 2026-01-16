
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** Inkwell
- **Date:** 2026-01-16
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 User sign-up with valid email and password
- **Test Code:** [TC001_User_sign_up_with_valid_email_and_password.py](./TC001_User_sign_up_with_valid_email_and_password.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/12cf15ce-66fe-445a-82ba-f9ec7aa845ef
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 User sign-up with invalid email format
- **Test Code:** [TC002_User_sign_up_with_invalid_email_format.py](./TC002_User_sign_up_with_invalid_email_format.py)
- **Test Error:** 
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH (at http://localhost:5194/node_modules/.vite/deps/lucide-react.js?v=484255dd:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/af231b73-8a65-4759-8903-e36acf7eeeb2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 User login with valid credentials
- **Test Code:** [TC003_User_login_with_valid_credentials.py](./TC003_User_login_with_valid_credentials.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/f31c0bcc-a05e-4079-8c3f-e15367f6b6b4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 User login with incorrect password
- **Test Code:** [TC004_User_login_with_incorrect_password.py](./TC004_User_login_with_incorrect_password.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/4d59d158-a1aa-4783-a23f-70d5b3f4052b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Session persistence after login
- **Test Code:** [TC005_Session_persistence_after_login.py](./TC005_Session_persistence_after_login.py)
- **Test Error:** The user session does not remain active after page refresh and navigation. After logging in successfully, refreshing the page or navigating to another page redirects the user back to the login form, indicating the session is not maintained. This results in a non-seamless user experience where the user must log in again after each page load or navigation.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/new-style-guide/planning/design-guidelines.json?import:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/main.tsx?t=1768571846646:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/4cc3d402-5b11-42e2-abd7-adf4af73ad15
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 User profile editing and saving changes
- **Test Code:** [TC006_User_profile_editing_and_saving_changes.py](./TC006_User_profile_editing_and_saving_changes.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/77bffa1f-4b81-4b35-840a-4cb462ff6cf1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Subscription status enforcement for feature access
- **Test Code:** [TC007_Subscription_status_enforcement_for_feature_access.py](./TC007_Subscription_status_enforcement_for_feature_access.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/bc3924ae-a6ff-4fa1-ba37-3b803240886b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Subscription trial checkout flow
- **Test Code:** [TC008_Subscription_trial_checkout_flow.py](./TC008_Subscription_trial_checkout_flow.py)
- **Test Error:** 
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/main.tsx?t=1768571846646:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/be3470a5-4459-42ea-83c0-e84d96e4a893
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Document creation from dashboard
- **Test Code:** [null](./null)
- **Test Error:** Test execution timed out after 15 minutes
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/4da6f2cb-c62c-47a4-a8ae-114af92bec78
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Inline document title editing with persistence
- **Test Code:** [TC010_Inline_document_title_editing_with_persistence.py](./TC010_Inline_document_title_editing_with_persistence.py)
- **Test Error:** The document titles cannot be edited inline on the dashboard as clicking the title navigates to an empty document page instead of enabling inline editing. Therefore, the task to ensure inline editing and persistence of document titles cannot be completed.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/components/editor/AIChat.tsx?t=1768571846751:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/new-style-guide/style-guide.css:0:0)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/index.css?t=1768571846646:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/f8287cd9-e482-4c9d-a43b-3ce80f947c00
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Document deletion from dashboard
- **Test Code:** [null](./null)
- **Test Error:** Test execution timed out after 15 minutes
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/ce6a4f88-a4ba-48c1-b785-c9a75a51b399
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Rich text formatting features in editor
- **Test Code:** [TC012_Rich_text_formatting_features_in_editor.py](./TC012_Rich_text_formatting_features_in_editor.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/90585bcd-d3ce-4c27-97e6-9f84bcffe793
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Auto-save completes within 500ms and updates save status indicator
- **Test Code:** [TC013_Auto_save_completes_within_500ms_and_updates_save_status_indicator.py](./TC013_Auto_save_completes_within_500ms_and_updates_save_status_indicator.py)
- **Test Error:** The document editor page is empty with no editor or content area to make changes. Auto-save functionality cannot be tested. Please check the application state or URL.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/new-style-guide/style-guide.css:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/fb19e03a-3269-4796-b3b0-654df222c4de
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Manual save shortcut functionality
- **Test Code:** [TC014_Manual_save_shortcut_functionality.py](./TC014_Manual_save_shortcut_functionality.py)
- **Test Error:** 
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/main.tsx?t=1768571846646:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/155ce3a7-1b76-438b-939f-18a4b2533fe9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Unsaved changes warning on navigation
- **Test Code:** [TC015_Unsaved_changes_warning_on_navigation.py](./TC015_Unsaved_changes_warning_on_navigation.py)
- **Test Error:** 
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/main.tsx?t=1768571846646:0:0)
[ERROR] WebSocket connection to 'ws://localhost:5194/?token=0wSvCoaYovzc' failed: Error in connection establishment: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/@vite/client:535:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/2a90a513-c48d-4faa-b5b9-c49ed051ae8a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Knowledge base add, view, and delete knowledge items
- **Test Code:** [TC016_Knowledge_base_add_view_and_delete_knowledge_items.py](./TC016_Knowledge_base_add_view_and_delete_knowledge_items.py)
- **Test Error:** The knowledge base page is empty with no UI elements to add, view, or delete knowledge items. Therefore, I cannot verify the requested functionality. Please check the application state or user permissions.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/components/editor/KnowledgePanel.tsx:0:0)
[WARNING] No routes matched location "/knowledge-base"  (at http://localhost:5194/node_modules/.vite/deps/react-router-dom.js?v=484255dd:635:48)
[WARNING] No routes matched location "/knowledge-base"  (at http://localhost:5194/node_modules/.vite/deps/react-router-dom.js?v=484255dd:635:48)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/aea3686c-7e64-4cda-a2d1-3d154db1d79d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Knowledge base items included in AI writing context
- **Test Code:** [TC017_Knowledge_base_items_included_in_AI_writing_context.py](./TC017_Knowledge_base_items_included_in_AI_writing_context.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/14c9d4f6-7b5e-4e8f-bba7-801179c2b754
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 AI chat assistant response time and accuracy
- **Test Code:** [TC018_AI_chat_assistant_response_time_and_accuracy.py](./TC018_AI_chat_assistant_response_time_and_accuracy.py)
- **Test Error:** The AI chat assistant was tested for response time and relevance by sending a context-rich query about renewable energy benefits. Despite successful login, document creation, and query submission, the assistant did not provide a visible response within 10 seconds on two separate attempts, including after page reload. This indicates a failure to meet the requirement of responding within 5-10 seconds with relevant answers based on document content, knowledge base, chat history, and AI instructions. Task is concluded with this result.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/node_modules/.vite/deps/html2canvas.js?v=484255dd:0:0)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/pages/Dashboard.tsx?t=1768571846646:0:0)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/c47a45ff-5919-41c8-8205-17f7725dd1ea
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 AI chat insertion and copying of responses
- **Test Code:** [TC019_AI_chat_insertion_and_copying_of_responses.py](./TC019_AI_chat_insertion_and_copying_of_responses.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/8c46be5e-8033-434a-aa3e-8c8b1dc0fc13
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Global and document-specific AI instructions management
- **Test Code:** [TC020_Global_and_document_specific_AI_instructions_management.py](./TC020_Global_and_document_specific_AI_instructions_management.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/6f4d44ca-8ae7-4071-bae0-f6e563e8459b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Document export to DOCX format preserves formatting
- **Test Code:** [TC021_Document_export_to_DOCX_format_preserves_formatting.py](./TC021_Document_export_to_DOCX_format_preserves_formatting.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/fc1d496d-6421-4fec-9aa0-e85d183868b2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Document export to PDF preserves formatting and multi-page layout
- **Test Code:** [TC022_Document_export_to_PDF_preserves_formatting_and_multi_page_layout.py](./TC022_Document_export_to_PDF_preserves_formatting_and_multi_page_layout.py)
- **Test Error:** 
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/@react-refresh:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/953511f5-8ff6-4900-b32c-bce93572b862
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023 Responsive UI behavior across desktop, tablet, and mobile devices
- **Test Code:** [TC023_Responsive_UI_behavior_across_desktop_tablet_and_mobile_devices.py](./TC023_Responsive_UI_behavior_across_desktop_tablet_and_mobile_devices.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/1948cac3-a471-4f5b-a77b-7b68c77f5331
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC024 Accessibility compliance for keyboard navigation and color contrast
- **Test Code:** [TC024_Accessibility_compliance_for_keyboard_navigation_and_color_contrast.py](./TC024_Accessibility_compliance_for_keyboard_navigation_and_color_contrast.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/eb6c194d-1041-4932-9cca-8ec8feec7d7e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025 Save operation latency and system uptime
- **Test Code:** [TC025_Save_operation_latency_and_system_uptime.py](./TC025_Save_operation_latency_and_system_uptime.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/4ef4c7b1-5a38-417f-ab15-bce4cac22552
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026 Robust error handling for network failures during document save
- **Test Code:** [TC026_Robust_error_handling_for_network_failures_during_document_save.py](./TC026_Robust_error_handling_for_network_failures_during_document_save.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/757ef5e7-9833-4c82-8338-d20b76b558fc
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC027 Security: password hashing and HTTPS enforcement
- **Test Code:** [TC027_Security_password_hashing_and_HTTPS_enforcement.py](./TC027_Security_password_hashing_and_HTTPS_enforcement.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/b3ea8f28-6fd5-47ef-b333-5aadb7be3d25
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC028 Security: CSRF protection on state-changing requests
- **Test Code:** [TC028_Security_CSRF_protection_on_state_changing_requests.py](./TC028_Security_CSRF_protection_on_state_changing_requests.py)
- **Test Error:** The application does not include CSRF tokens in traditional forms like login and registration, indicating a potential vulnerability to CSRF attacks on these forms. Document creation and editing are handled via API calls, but due to lack of direct network inspection, it is unclear if CSRF tokens are included and validated in these API requests. Further manual or automated network analysis is recommended to confirm CSRF protection on API calls. Overall, the task to ensure CSRF protection is not fully complete due to these limitations.
Browser Console Logs:
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/main.tsx?t=1768571846646:0:0)
[ERROR] Failed to load resource: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/src/App.tsx?t=1768571846646:0:0)
[WARNING] No routes matched location "/register"  (at http://localhost:5194/node_modules/.vite/deps/react-router-dom.js?v=484255dd:635:48)
[WARNING] No routes matched location "/register"  (at http://localhost:5194/node_modules/.vite/deps/react-router-dom.js?v=484255dd:635:48)
[ERROR] WebSocket connection to 'ws://localhost:5194/?token=0wSvCoaYovzc' failed: Error in connection establishment: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/@vite/client:535:0)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[WARNING] [tiptap warn]: Duplicate extension names found: ['underline']. This can lead to issues. (at http://localhost:5194/node_modules/.vite/deps/chunk-KYWGMG7B.js?v=484255dd:13529:12)
[ERROR] WebSocket connection to 'wss://necessary-magpie-326.convex.cloud/api/1.31.3/sync' failed: Error in connection establishment: net::ERR_EMPTY_RESPONSE (at http://localhost:5194/node_modules/.vite/deps/convex_react.js?v=484255dd:1223:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/4c11f3af-f5ea-4192-850f-bec75d420ca8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC029 User data scoped access control enforcement
- **Test Code:** [TC029_User_data_scoped_access_control_enforcement.py](./TC029_User_data_scoped_access_control_enforcement.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5194/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/5af314ad-1c8d-4325-823d-55e59b88f4dc/0c4e918d-b72d-4975-8260-4129a1081636
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---