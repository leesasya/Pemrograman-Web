# 2nd Assignment: School Website

**Name: Khalisya Zahra Putria Rahman**

**NRP: 5025251045**

**Class: Web Programming B**

## Features and Pages

This website consists of several interconnected pages featuring responsive main navigation. Each section within the HTML pages is clearly organized and labeled with neat comments.

### 1. Home [`index.html`](index.html)
The main page providing an overview of the school.
- **Home Hero**: Displays the main banner, motto, and call-to-action.
- **Values**: Presents core values ​​(*Shalih*, *Muslih*, *Qudwah*).
- **School Profile**: A welcome message from the Principal.
- **Vision & Mission**: Description of the school's vision and mission.
- **School Information**: Quick links to the Departments, Student Life, Alumni, and Contact pages.
- **Enrollment**: Directions to the official enrollment website.

### 2. Departments and Curriculum [`kurikulum.html`](kurikulum.html)
- **Department Hero**: Introduction to the academic programs.
- **Department List**: Outlines the academic focus for Science (IPA) and Social Studies (IPS) streams, along with subject lists.
- **Student Count**: A dynamic table displaying student numbers for each department.
- **Support Programs**: Explanations of supplementary programs and specific programs for Grade 12 students.
- **Teaching Staff**: A list of teachers featuring an interactive search function built with JavaScript.

### 3. Student Life [`kesiswaan.html`](kesiswaan.html)
- **Student Life Hero**: Introduction to student affairs programs.
- **Guidance**: Explanations regarding character building and counseling services.
- **Uniforms**: An interactive visual guide to uniforms, categorized by day (using JavaScript tabs).
- **Extracurriculars**: A list of interactive extracurricular activities; details appear in a modal (dialog box) when clicked.
- **OSPETA**: The student organization structure (OSPETA) for male and female students, including their respective working divisions.

### 4. Alumni [`alumni.html`](alumni.html)
- **Alumni Hero**: Introduction to the alumni database search. 
- **Alumni Data**: An alumni data search table integrated with JavaScript (enabling searches by name, year, and university, along with pagination).
- **Alumni Stories**: A section showcasing alumni stories.
- **Share a Story**: A form for submitting alumni stories.

### 5. Contact [`kontak.html`](kontak.html)
- **Contact Hero**: Introduction to the contact page.
- **Contact Information**: Full address, phone number, email, office hours, and a location map using a Google Maps iframe.
- **Contact Form**: A message submission form linked to email services (opens the user's email client with the entered data).
- **Social Media**: Official social media channels and the school's YouTube video gallery.

## Code Structure (CSS & JS)

### JavaScript (`assets/app.js`)
The site features lightweight DOM interactions that do not require additional frameworks:
- **Mobile Menu (`setMenu`)**: Toggles navigation on small-screen devices.
- **Modal / Dialog (`openDialog`)**: Displays interactive modals for uniform details, extracurricular information, detailed alumni profiles, and alumni story previews.
- **Tabs Interface**: An interactive tab system to display uniform details (Monday-Tuesday, Wednesday, Thursday, etc.).
- **Live Search & Pagination**: Search functionality for staff (`teacher-search`) and alumni data (`alumni-search`), complete with filters and data pagination sourced from `assets/data/content.js`.
- **Form Handling**: Intercepts submit events from `contact-form` and `alumni-story-form` to format messages and trigger `mailto:` actions or preview modals.
- **Scroll Reveal (`IntersectionObserver`)**: Reveals elements with smooth animations as they enter the viewport.

### CSS (`assets/style.css`)
- **Responsive Design**: Uses media queries to adjust layouts for mobile, tablet, and desktop devices.
- **CSS Variables**: Defines tokens for colors (primary theme color `#1d503b`), typography (Outfit font), spacing, and animations to ensure site-wide consistency.
- **UI Components**: Styling for navigation, buttons, cards, tables, input forms, tabs, dialogs (modals), and other utility components.
- **Animations and Transitions**: Manages `hover` effects, `opacity` & `transform` transitions for scroll-based reveals, and modal interactions.

## Run / Preview

The project is deployed at https://schoolweb-pweb.vercel.app/.
