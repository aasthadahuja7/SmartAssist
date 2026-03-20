import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // 🔐 1. BRAND NEW SECURITY STATE: Stores mathematically signed JWT tokens natively in the browser!
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  // ⚙️ 2. New Identity Form States
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Chat States
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 🛡️ 3. Only fetch the strict database history IF the user is authenticated with a token!
  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  // 📝 4. Handle Registration OR Logging In securely
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.status === 201) {
        // Successful registration into Docker, seamlessly switch to login
        setIsRegister(false);
        setAuthError("Registration successful! Please log in.");
      } else if (res.status === 200 && data.token) {
        // Securely login and save the physical token to the browser storage
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setAuthError("Could not reach the server! Is it running?");
    } finally {
      setLoading(false);
    }
  };

  // Log Out instantly by physically deleting the token from browser memory
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setHistory([]);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/history", {
        // 🔥 We explicitly hand the invisible Bearer token directly to the backend Security Guard!
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.status === 401) return handleLogout(); // Guard kicked them out! Force a logout.
      
      const data = await res.json();
      if (data.success) {
        setHistory(data.data.reverse()); 
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleAsk = async () => {
    if (!query.trim() && !file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("query", query);
    if (file) formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5001/api/ask", {
        method: "POST",
        // 🔥 Mathematically proving authorization to the backend Guard BEFORE asking Gemini!
        headers: { "Authorization": `Bearer ${token}` }, 
        body: formData
      });
      
      if (res.status === 401) return handleLogout(); // Guard explicitly blocked them
      
      await res.json();
      setQuery("");
      setFile(null);
      await fetchHistory();
    } catch (err) {
      alert("Failed to reach the server!");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // THE NEW LOGIN SCREEN GATE (Blocks rendering entire app if no token!)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', WebkitBoxAlign: 'center', background: '#F8F9FA' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', width: '400px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--primary-green)', marginBottom: '15px' }}>
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-1.5609-3.2505 5.9847 5.9847 0 0 0-3.2505-1.5609 5.9847 5.9847 0 0 0-3.665.2355 5.9847 5.9847 0 0 0-2.6106 1.765 5.9847 5.9847 0 0 0-2.6106-1.765 5.9847 5.9847 0 0 0-3.665-.2355 5.9847 5.9847 0 0 0-3.2505 1.5609 5.9847 5.9847 0 0 0-1.5609 3.2505 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0-1.765 2.6106 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0 1.5609 3.2505 5.9847 5.9847 0 0 0 3.2505 1.5609 5.9847 5.9847 0 0 0 3.665-.2355 5.9847 5.9847 0 0 0 2.6106 1.765 5.9847 5.9847 0 0 0 3.665.2355 5.9847 5.9847 0 0 0 3.2505-1.5609 5.9847 5.9847 0 0 0 1.5609-3.2505 5.9847 5.9847 0 0 0-.2355-3.665 5.9847 5.9847 0 0 0 1.765-2.6106 5.9847 5.9847 0 0 0-.2355-3.665zm-11.237 9.8732a3.993 3.993 0 0 1-2.903-1.205 3.993 3.993 0 0 1-1.168-2.939H12a2 2 0 1 0 0-4H6.884a4.01 4.01 0 0 1 1.714-2.84 4.01 4.01 0 0 1 3.447-.532l1 1.732a2 2 0 1 0 3.464-2l-1-1.732a3.993 3.993 0 0 1 2.903 1.205 3.993 3.993 0 0 1 1.168 2.939H14.41a2 2 0 1 0 0 4h5.116a4.01 4.01 0 0 1-1.714 2.84 4.01 4.01 0 0 1-3.447.532l-1-1.732a2 2 0 1 0-3.464 2l1 1.732h.142z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Welcome to Smart-Assist</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '8px' }}>Securely access your multimodal AI</p>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none' }} 
            />
            <input 
              type="password" 
              placeholder="Secure Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '1rem', outline: 'none' }} 
            />
            
            {authError && <p style={{ color: authError.includes("successful") ? 'var(--primary-green)' : '#EF4444', fontSize: '0.85rem', textAlign: 'center' }}>{authError}</p>}
            
            <button type="submit" disabled={loading} style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
              {loading ? "Processing..." : (isRegister ? "Create Account" : "Log In")}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#6B7280' }}>
             {isRegister ? "Already have an account?" : "Don't have an account?"} 
             <span onClick={() => {setIsRegister(!isRegister); setAuthError("");}} style={{ color: 'var(--primary-green)', fontWeight: 600, marginLeft: '6px', cursor: 'pointer' }}>
               {isRegister ? "Sign In" : "Register"}
             </span>
          </p>
        </div>
      </div>
    );
  }

  // Helper component to dry up the sidebar buttons
  const SidebarItem = ({ title, active, onClick, children }) => (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0', cursor: 'pointer',
        color: active ? 'var(--primary-green)' : '#6B7280',
        fontWeight: active ? 600 : 400
      }}
    >
      {children}
      {title}
    </div>
  );

  return (
    <>
      <aside className="sidebar" style={{ position: 'relative' }}>
        <h2 style={{ color: 'var(--primary-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-1.5609-3.2505 5.9847 5.9847 0 0 0-3.2505-1.5609 5.9847 5.9847 0 0 0-3.665.2355 5.9847 5.9847 0 0 0-2.6106 1.765 5.9847 5.9847 0 0 0-2.6106-1.765 5.9847 5.9847 0 0 0-3.665-.2355 5.9847 5.9847 0 0 0-3.2505 1.5609 5.9847 5.9847 0 0 0-1.5609 3.2505 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0-1.765 2.6106 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0 1.5609 3.2505 5.9847 5.9847 0 0 0 3.2505 1.5609 5.9847 5.9847 0 0 0 3.665-.2355 5.9847 5.9847 0 0 0 2.6106 1.765 5.9847 5.9847 0 0 0 3.665.2355 5.9847 5.9847 0 0 0 3.2505-1.5609 5.9847 5.9847 0 0 0 1.5609-3.2505 5.9847 5.9847 0 0 0-.2355-3.665 5.9847 5.9847 0 0 0 1.765-2.6106 5.9847 5.9847 0 0 0-.2355-3.665zm-11.237 9.8732a3.993 3.993 0 0 1-2.903-1.205 3.993 3.993 0 0 1-1.168-2.939H12a2 2 0 1 0 0-4H6.884a4.01 4.01 0 0 1 1.714-2.84 4.01 4.01 0 0 1 3.447-.532l1 1.732a2 2 0 1 0 3.464-2l-1-1.732a3.993 3.993 0 0 1 2.903 1.205 3.993 3.993 0 0 1 1.168 2.939H14.41a2 2 0 1 0 0 4h5.116a4.01 4.01 0 0 1-1.714 2.84 4.01 4.01 0 0 1-3.447.532l-1-1.732a2 2 0 1 0-3.464 2l1 1.732h.142z" />
          </svg>
          Smart-Assist
        </h2>
        
        {/* Navigation Menu */}
        <div style={{ marginTop: '40px', fontSize: '0.9rem' }}>
          <SidebarItem title="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </SidebarItem>
          
          <SidebarItem title="AI Chatbot" active={activeTab === "AI Chatbot"} onClick={() => setActiveTab("AI Chatbot")}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          </SidebarItem>
          
          <SidebarItem title="Activity History" active={activeTab === "Activity History"} onClick={() => setActiveTab("Activity History")}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </SidebarItem>
        </div>

        {/* Dynamic Log Out Button pinned to the bottom of the sidebar! */}
        <div 
          onClick={handleLogout}
          style={{ position: 'absolute', bottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#EF4444', fontWeight: 600, fontSize: '0.9rem' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Log Out
        </div>
      </aside>

      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Dynamic Header */}
        <div style={{ marginBottom: "20px", flexShrink: 0 }}>
          <p style={{ color: "var(--text-secondary)", fontWeight: 500, marginBottom: "8px" }}>
            Welcome to Smart-Assist AI
          </p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {activeTab === "Dashboard" && "Explore Your Dashboard"}
            {activeTab === "AI Chatbot" && "Ask me anything—I'm here to help!"}
            {activeTab === "Activity History" && "Your Secure Conversation History"}
          </h1>
        </div>

        {/* TAB 1: THE DASHBOARD */}
        {activeTab === "Dashboard" && (
          <div className="explorer-section" style={{ marginTop: '0' }}>
            <h3 className="explorer-header">Explore by ready prompt</h3>
            <div className="cards-grid">
              <div className="prompt-card" onClick={() => { setActiveTab("AI Chatbot"); setQuery("Write an essay for me."); }}>
                <div className="card-icon" style={{ color: '#10B981' }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <div className="card-title">Writing</div>
                <div className="card-desc">Elevate your writing with tools designed for seamless creation.</div>
              </div>
              <div className="prompt-card" onClick={() => { setActiveTab("AI Chatbot"); setQuery("Research the latest market trends."); }}>
                <div className="card-icon" style={{ color: '#F59E0B' }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div className="card-title">Research & Analysis</div>
                <div className="card-desc">Discover, analyze, interpret, and present information with clarity.</div>
              </div>
              <div className="prompt-card" onClick={() => { setActiveTab("AI Chatbot"); setQuery("Review this JavaScript code."); }}>
                <div className="card-icon" style={{ color: '#F97316' }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <div className="card-title">Programming</div>
                <div className="card-desc">Develop robust code, debug effectively, and test thoroughly.</div>
              </div>
              <div className="prompt-card" onClick={() => { setActiveTab("AI Chatbot"); setQuery("Teach me how React hooks work."); }}>
                <div className="card-icon" style={{ color: '#8B5CF6' }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                </div>
                <div className="card-title">Learning Skills</div>
                <div className="card-desc">Embark on a journey of innovation, exploring existing skills.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 & 3: Chat History Map */}
        {(activeTab === "AI Chatbot" || activeTab === "Activity History") && (
          <div className="chat-history" style={{ flex: 1, overflowY: "auto", marginBottom: "20px" }}>
            {history.length === 0 ? (
              <p style={{ color: "#9CA3AF" }}>No conversations yet. Upload an image or send a prompt below!</p>
            ) : (
              history.map((chat) => (
                <div key={chat.id} style={{ marginBottom: '24px' }}>
                  <div style={{ background: '#F3F4F6', padding: '16px', borderRadius: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, color: '#111827' }}>
                      <div style={{ background: '#E5E7EB', color: '#4B5563', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>U</div>
                      You
                    </div>
                    <p style={{ marginTop: '8px', paddingLeft: '36px' }}>{chat.query}</p>
                    {chat.image_name && <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '8px', paddingLeft: '36px' }}>📎 Attached: {chat.image_name}</p>}
                  </div>
                  
                  <div style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '12px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: 'var(--primary-green)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-1.5609-3.2505 5.9847 5.9847 0 0 0-3.2505-1.5609 5.9847 5.9847 0 0 0-3.665.2355 5.9847 5.9847 0 0 0-2.6106 1.765 5.9847 5.9847 0 0 0-2.6106-1.765 5.9847 5.9847 0 0 0-3.665-.2355 5.9847 5.9847 0 0 0-3.2505 1.5609 5.9847 5.9847 0 0 0-1.5609 3.2505 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0-1.765 2.6106 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0 1.5609 3.2505 5.9847 5.9847 0 0 0 3.2505 1.5609 5.9847 5.9847 0 0 0 3.665-.2355 5.9847 5.9847 0 0 0 2.6106 1.765 5.9847 5.9847 0 0 0 3.665.2355 5.9847 5.9847 0 0 0 3.2505-1.5609 5.9847 5.9847 0 0 0 1.5609-3.2505 5.9847 5.9847 0 0 0-.2355-3.665 5.9847 5.9847 0 0 0 1.765-2.6106 5.9847 5.9847 0 0 0-.2355-3.665zm-11.237 9.8732a3.993 3.993 0 0 1-2.903-1.205 3.993 3.993 0 0 1-1.168-2.939H12a2 2 0 1 0 0-4H6.884a4.01 4.01 0 0 1 1.714-2.84 4.01 4.01 0 0 1 3.447-.532l1 1.732a2 2 0 1 0 3.464-2l-1-1.732a3.993 3.993 0 0 1 2.903 1.205 3.993 3.993 0 0 1 1.168 2.939H14.41a2 2 0 1 0 0 4h5.116a4.01 4.01 0 0 1-1.714 2.84 4.01 4.01 0 0 1-3.447.532l-1-1.732a2 2 0 1 0-3.464 2l1 1.732h.142z" />
                        </svg>
                      </div>
                      Smart-Assist
                    </div>
                    
                    <div style={{ marginTop: '12px', paddingLeft: '36px' }}>
                      {Array.isArray(chat.ai_response) ? (
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {chat.ai_response.map((item, idx) => (
                            <div key={idx} style={{ background: '#F9FAFB', padding: '12px', borderRadius: '8px', border: '1px solid #F3F4F6' }}>
                              <h4 style={{ color: '#111827', fontSize: '0.95rem' }}>{item.title}</h4>
                              <p style={{ color: '#4B5563', fontSize: '0.85rem', marginTop: '4px' }}>{item.details}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>{typeof chat.ai_response === 'string' ? chat.ai_response : JSON.stringify(chat.ai_response)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: 'var(--primary-green)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-1.5609-3.2505 5.9847 5.9847 0 0 0-3.2505-1.5609 5.9847 5.9847 0 0 0-3.665.2355 5.9847 5.9847 0 0 0-2.6106 1.765 5.9847 5.9847 0 0 0-2.6106-1.765 5.9847 5.9847 0 0 0-3.665-.2355 5.9847 5.9847 0 0 0-3.2505 1.5609 5.9847 5.9847 0 0 0-1.5609 3.2505 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0-1.765 2.6106 5.9847 5.9847 0 0 0 .2355 3.665 5.9847 5.9847 0 0 0 1.5609 3.2505 5.9847 5.9847 0 0 0 3.2505 1.5609 5.9847 5.9847 0 0 0 3.665-.2355 5.9847 5.9847 0 0 0 2.6106 1.765 5.9847 5.9847 0 0 0 3.665.2355 5.9847 5.9847 0 0 0 3.2505-1.5609 5.9847 5.9847 0 0 0 1.5609-3.2505 5.9847 5.9847 0 0 0-.2355-3.665 5.9847 5.9847 0 0 0 1.765-2.6106 5.9847 5.9847 0 0 0-.2355-3.665zm-11.237 9.8732a3.993 3.993 0 0 1-2.903-1.205 3.993 3.993 0 0 1-1.168-2.939H12a2 2 0 1 0 0-4H6.884a4.01 4.01 0 0 1 1.714-2.84 4.01 4.01 0 0 1 3.447-.532l1 1.732a2 2 0 1 0 3.464-2l-1-1.732a3.993 3.993 0 0 1 2.903 1.205 3.993 3.993 0 0 1 1.168 2.939H14.41a2 2 0 1 0 0 4h5.116a4.01 4.01 0 0 1-1.714 2.84 4.01 4.01 0 0 1-3.447.532l-1-1.732a2 2 0 1 0-3.464 2l1 1.732h.142z" />
                    </svg>
                  </div>
                  Smart-Assist is evaluating...
                  <div className="typing-indicator" style={{ marginLeft: '6px' }}>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB BOTTOM INPUT: ONLY SHOW IF ON AI CHATBOT TAB */}
        {activeTab === "AI Chatbot" && (
          <div className="chat-input-wrapper" style={{ flexShrink: 0 }}>
            <textarea 
              className="chat-textarea" 
              placeholder="Whatever you need, just ask Smart-Assist!"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            ></textarea>
            
            <div className="chat-toolbar">
              <div className="toolbar-actions">
                <label className="action-btn" style={{ cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    style={{ display: 'none' }} 
                    accept="image/*, application/pdf"
                  />
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {file ? file.name : "Upload Image"}
                </label>

                <button className="action-btn" onClick={() => setQuery("Give me top 3 web developer skills to learn in 2024")}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  Core Think
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="char-counter">{query.length}/10,000</span>
                <button 
                  className="submit-btn" 
                  style={{ background: loading ? '#9CA3AF' : '#55A57A', cursor: loading ? 'not-allowed' : 'pointer' }} 
                  onClick={handleAsk} 
                  disabled={loading}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ strokeWidth: 2 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}

export default App;
