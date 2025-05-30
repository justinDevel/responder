<p align="center">
  <img src="logo.jpg" alt="Responder Logo" width="200"/>
</p>

# 🛡️ Responder – Multi-Agent AI for Public Safety
Empowering Indiana Communities with Multi-Agent AI to Report Hazards, Dispatch Alerts, and Coordinate Crisis Response

## 🏆 Hackathon Submission
**Indy Civic Tech Hackathon 2025**  
Challenge: _Chatbots for Public Safety – Serving 870,000+ Indianapolis residents_

---

## 🧠 Project Overview

**RESPONDER** is an intelligent multi-agent AI system designed to enhance public safety in Indianapolis. It uses a team of specialized AI agents — each with a distinct emergency response role — to analyze citizen-reported input and generate real-time, multi-perspective safety responses. The system supports:

- **Hazard Detection**
- **Emergency Dispatch Guidance**
- **Triage Evaluation**
- **Crisis Coordination**

Responses are synthesized through AI agents that collaborate intelligently via natural language.

---

## 🧩 Project Structure

```bash
responder/
├── backend/         # FastAPI app with AI orchestration logic
├── frontend/        # Next.js React frontend with chat interface
````



## 🚀 Features

* ✅ **Multi-agent AI orchestration using Perplexity AI**
* ✅ **Static agents with role-specific prompts**
* ✅ **Internet-connected medical agent for real-time info**
* ✅ **Frontend chat with Markdown rendering**
* ✅ **Public safety-focused UX (hazards, emergencies, coordination)**
* ✅ **Ready to deploy for 870,000+ residents**

---

## 🗃️ Backend (FastAPI)

**Directory:** `/backend`

### Description:

Handles agent processing, prompt injection, AI querying, and response synthesis.

### Tech Stack:

* Python 3.11
* FastAPI
* Jinja2 (dynamic prompt templates)
* Async API calls to Perplexity

### How to Run:


```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

> Make sure `.env` is configured with your PERPLEXITY_API_KEY replace `your_perplexity_api_key_here` string with your PERPLEXITY_API_KEY :
> To obtain your PERPLEXITY_API_KEY , Follow the offical docs here [How To Get My Perplexity API](https://docs.perplexity.ai/guides/getting-started)

```env
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### Endpoints:

| Route      | Method | Description                                 |
| ---------- | ------ | ------------------------------------------- |
| `/api/ask` | POST   | Accepts user input and returns AI responses |

---

## 💻 Frontend (Next.js)

**Directory:** `/frontend`

### Description:

User-facing interface to interact with CivicAI agents through a sleek, mobile-friendly chat UI.

### Tech Stack:

* Next.js (React 18+)
* Tailwind CSS
* React Markdown
* Vercel-ready deployment

### How to Run:

```bash
cd frontend
npm install
npm run dev
```

> Make sure `.env.local` is configured with the backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 How to Test

1. Run the backend and frontend locally
2. Visit `http://localhost:3000`
3. Ask a public safety question like:

   * “There’s a gas leak near 10th Street – what do I do?”
   * “Someone collapsed in a store. What are the steps for first aid?”
   * “I saw smoke in a nearby apartment. Should I report it?”

Agents will respond with coordinated, role-based feedback.

---

## 🧠 AI Agent Roles (Static)

| Agent ID             | Role                       | Description                                               |
| -------------------- | -------------------------- | --------------------------------------------------------- |
| `hazard-reporter`    | Hazard Reporter            | Flags potential threats or risks                          |
| `emergency-dispatch` | Emergency Alert Dispatcher | Outlines escalation protocols                             |
| `medical-triage`     | Medical Triage Advisor     | Gives basic medical support guidance                      |
| `crisis-coordinator` | Crisis Coordinator         | Synthesizes all agent responses into one holistic message |

---

## 🌐 Deployment

* Backend: Deployable to Fly.io, Render, or Railway
* Frontend: Ready for Vercel or Netlify

---

## 📹 Demo Video

Watch our 3-minute demo:
📺 [YouTube Demo Video](https://youtu.be/uzptQEhwR2c)

---

## 📂 Code Repositories

* Frontend + Backend: [github.com/justinDevel/Responder](https://github.com/justinDevel/Responder)


---

## 💡 Future Improvements

* Enable user-created custom agents
* Voice-based chatbot interface
* Integration with Indy public safety APIs (e.g., 311, fire dispatch)
* Location-aware AI prompts (GPS-based prompts and routing)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Author

Built with 💙 for the people of Indiana.

---

> “AI isn’t replacing humans — it’s helping protect them.”

