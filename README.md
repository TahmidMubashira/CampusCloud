# Campus Cloud : University Resource Hub

## Team Members

**1.Tahmid Mubashira Obonti**  
- Role: Team Lead  
- Email: tahmid.cse.20230104048@aust.edu  
- ID: 20230104048 

**2.Tasmia Tabassum Shreoshi**  
- Role: Front-end Developer  
- Email: tasmia.cse.20230104026@aust.edu  
- ID: 20230104026  

**3.Tasnima Faruk Prapty**  
- Role: Back-end Developer  
- Email: tasnima.cse.20230104038@aust.edu  
- ID: 20230104038    


---

## Project Overview

### Objective
Campus Cloud is a centralized university resource hub designed to help students efficiently share, access, and manage academic materials. By organizing resources by department and course and incorporating contribution-based incentives, the platform aims to enhance collaboration, academic productivity, and accessibility.


### Target Audience

- University students  
- Faculty members  
- Academic administrators  

---

## Tech Stack

**Backend:** Laravel  
**Database:** MSSQL  
**Frontend:** React.js  
**Styling:** Tailwind CSS / Bootstrap  
**Rendering Method:** Client-Side Rendering (CSR)

---

## UI Design

- Mock UI is designed using **Figma** to visualize the overall layout and user flow.

- **Figma Link: https://www.figma.com/design/OnwMVW5fPw7hrJMoeM4iiy/CampusCloud?node-id=2-2&t=yRRqf4Aedhmhhazz-1**  


---

## Project Features

### Core Features
- Centralized academic resource repository organized by department and course  
- Upload, download, and manage academic resources  
- Contribution and reward system to encourage student participation  
- Activity tracking for uploads and downloads  
- Admin review and approval of uploaded resources  
- Advanced search and filtering mechanism  


### AI-Assisted Features

- **Smart Resource Recommendation**  
  Recommends relevant academic resources to students based on their department, enrolled courses, and previous download history.

- **Personalized Study Suggestions**  
  Suggests useful materials by analyzing user activity, frequently accessed topics, and academic preferences.

- **Contribution Quality Insights**  
  Assists administrators by highlighting high-quality or frequently accessed resources for faster approval decisions.

- **Search Relevance Enhancement**  
  Improves search results by prioritizing resources based on popularity, relevance, and user interaction patterns.

- **Engagement Analytics Support**  
  Provides insights into student engagement trends, such as most accessed resources and active contributors, to support data-driven improvements.


### CRUD Operations

- Students  
- Resources  
- Departments  
- Courses  
- Activity History  
- Rewards  

---

## API Endpoints (Approximate)

```http
POST   /auth/register
POST   /auth/login
GET    /resources
POST   /resources
PUT    /resources/{id}
DELETE /resources/{id}
GET    /history
GET    /rewards
```

---

## Milestones

### Milestone 1: System Foundation
- Define project requirements and scope  
- Design database schema and ER diagram  
- Implement user authentication system  
- Develop basic user interface layout  
- Set up resource upload and download functionality  


### Milestone 2: Resource Management & Tracking
- Organize resources by department and course  
- Implement admin approval workflow for uploaded resources  
- Develop activity tracking for uploads and downloads  
- Implement reward point system for student contributions  
- Integrate frontend with backend APIs  


### Milestone 3: Finalization & Optimization
- Implement advanced search and filtering features  
- Optimize system performance and database queries  
- Conduct full system testing and bug fixing  
- Improve UI/UX consistency  
- Prepare final documentation and deployment  

