# Product Requirements Document (PRD)

**Product Name:** LinkNest  
**Owner:** Senior Product Manager (ChatGPT)  
**Date:** July 6, 2025  
**Version:** 1.0  

---

## 1. Objective

To build a lightweight, intuitive content management web app where users can store, categorize, and retrieve social media content (YouTube videos, Tweets, and LinkedIn posts) by pasting links.

---

## 2. Problem Statement

Users come across valuable content on platforms like YouTube, Twitter (X), and LinkedIn but lose track of them over time. Traditional bookmarking tools are either too generic or don’t display rich previews, metadata, or enable smart tagging. There's a need for a focused tool for curating and organizing valuable web content in one place.

---

## 3. Goals & Success Metrics

### Goals
- Allow users to save and categorize social media links.
- Display link previews (thumbnail, metadata, etc.).
- let the user play the video on the library itself ("use iframe ")
- Enable easy search, tagging, and filtering.
- Simple UI for quick pasting and viewing.

### Success Metrics
- Time to save a link: < 3 seconds.
- >80% user retention after 7 days of use.
- >90% successful metadata extraction from supported platforms.
- Average session time > 3 minutes.

---

## 4. User Stories

### MVP (Phase 1)
- ✅ As a user, I can paste a link and store it.
- ✅ As a user, I can view a preview (title, thumbnail) of the content.
- ✅ As a user, I can tag links with keywords.
- ✅ As a user, I can filter and search links by tags or source (YouTube, Twitter, LinkedIn).
- ✅ As a user, I can edit or delete stored links.

### Future Scope
- 🔜 Chrome Extension for 1-click saving.
- 🔜 AI-based tagging or summarization.
- 🔜 Public/shared collections.
- 🔜 Mobile app.

---

## 5. Functional Requirements

### 5.1 Add Link Flow

| Requirement    | Description                                                 |
|----------------|-------------------------------------------------------------|
| Input          | User pastes a link from YouTube, Twitter, or LinkedIn       |
| Validation     | Must match domain patterns (e.g., `youtube.com`, `x.com`)   |
| Metadata Fetch | Use open graph scraping or APIs to fetch metadata           |
| Store          | Save to DB: link, title, platform, tags, date added, user ID|

### 5.2 Display Links
- Show card view with title, thumbnail, platform icon.
- Clicking opens the original link in a new tab.

### 5.3 Organize & Filter
- Tag input field when saving.
- Tags can be clicked to filter content.
- Search bar for keyword matching in title or tags.

### 5.4 Edit/Delete
- User can edit tags or delete a saved link from their library.

---

## 6. Non-functional Requirements

| Requirement | Description                            |
|-------------|----------------------------------------|
| Performance | Metadata scraping < 1.5s               |
| Scalability | Support up to 10,000 links per user    |
| Security    | OAuth login (Google or GitHub)         |
| Privacy     | Only the user can view their content   |
| Compatibility | Responsive design for all screens    |

---

## 7. Tech Stack Suggestions

| Component | Tech                              |
|----------|------------------------------------|
| Frontend | Next.js + TailwindCSS + shadcn/ui  |
| Backend  | Node.js (Express or Next.js APIs)  |
| Database | PostgreSQL                         |
| Auth     | Clerk or Auth.js                   |
| Previews | LinkPreview API or Open Graph scrape |
| Hosting  | Vercel or Render                   |

---

