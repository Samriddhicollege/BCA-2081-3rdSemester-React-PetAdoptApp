import { useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, createContext } from "react";

// ─── CONTEXT (useContext + createContext) ───────────────────────────────────
const AdoptionContext = createContext();

// ─── REDUCER (useReducer) ───────────────────────────────────────────────────
const adoptionReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return { ...state, favorites: state.favorites.filter((id) => id !== action.payload) };
    case "SUBMIT_APPLICATION":
      return { ...state, applications: [...state.applications, action.payload] };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

// ─── DATA ───────────────────────────────────────────────────────────────────
const PETS = [
  { id: 1, name: "Luna", type: "Dog", breed: "Golden Retriever", age: 2, gender: "Female", size: "Large", status: "Available", personality: ["Playful", "Gentle", "Smart"], description: "Luna is a joyful Golden Retriever who loves fetch and cuddles. She's great with kids and other dogs.", img: "🐕", color: "#F4A460", bg: "#FFF8F0" },
  { id: 2, name: "Mochi", type: "Cat", breed: "Scottish Fold", age: 1, gender: "Male", size: "Small", status: "Available", personality: ["Calm", "Curious", "Affectionate"], description: "Mochi is a serene Scottish Fold who loves sunny windowsills and gentle play. Perfect for apartment life.", img: "🐱", color: "#9B8EAF", bg: "#F5F0FF" },
  { id: 3, name: "Rio", type: "Bird", breed: "African Grey", age: 3, gender: "Male", size: "Small", status: "Available", personality: ["Intelligent", "Talkative", "Social"], description: "Rio is an exceptionally smart African Grey who can hold real conversations and loves interaction.", img: "🦜", color: "#4CAF8A", bg: "#F0FFF8" },
  { id: 4, name: "Bear", type: "Dog", breed: "Siberian Husky", age: 4, gender: "Male", size: "Large", status: "Available", personality: ["Energetic", "Loyal", "Vocal"], description: "Bear is a stunning Husky who needs an active family. He loves runs, hikes, and howling at the moon.", img: "🐺", color: "#5B9BD5", bg: "#F0F6FF" },
  { id: 5, name: "Cleo", type: "Cat", breed: "Siamese", age: 5, gender: "Female", size: "Medium", status: "Pending", personality: ["Vocal", "Intelligent", "Loyal"], description: "Cleo is a sophisticated Siamese who will follow you room to room and tell you all about her day.", img: "😸", color: "#E8A87C", bg: "#FFF5EE" },
  { id: 6, name: "Pepper", type: "Rabbit", breed: "Holland Lop", age: 1, gender: "Female", size: "Small", status: "Available", personality: ["Gentle", "Curious", "Quiet"], description: "Pepper is a sweet Holland Lop who loves fresh veggies and gentle pets. Ideal for a calm home.", img: "🐰", color: "#E91E8C", bg: "#FFF0F8" },
  { id: 7, name: "Max", type: "Dog", breed: "French Bulldog", age: 3, gender: "Male", size: "Medium", status: "Available", personality: ["Playful", "Stubborn", "Loving"], description: "Max is a charismatic Frenchie with a personality ten times his size. He's a homebody who loves naps.", img: "🐶", color: "#FF7043", bg: "#FFF3EE" },
  { id: 8, name: "Willow", type: "Cat", breed: "Maine Coon", age: 2, gender: "Female", size: "Large", status: "Available", personality: ["Gentle", "Playful", "Social"], description: "Willow is a magnificent Maine Coon with a fluffy mane and dog-like personality. She loves water!", img: "🦁", color: "#795548", bg: "#FFF8F5" },
];

const STATS = [
  { label: "Pets Adopted", value: "2,400+", icon: "🏠" },
  { label: "Happy Families", value: "1,800+", icon: "❤️" },
  { label: "Partner Shelters", value: "120+", icon: "🤝" },
  { label: "Cities Served", value: "50+", icon: "🌍" },
];

// ─── CUSTOM HOOK (Custom Hook) ──────────────────────────────────────────────
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };
  return [storedValue, setValue];
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FDFAF5;
    --warm: #F5EDD8;
    --terracotta: #C4603B;
    --terracotta-light: #E8855F;
    --forest: #2D4A3E;
    --forest-light: #4A7A68;
    --gold: #D4A843;
    --charcoal: #2C2C2C;
    --muted: #6B6B6B;
    --border: #E8E0D0;
    --white: #FFFFFF;
    --shadow: 0 4px 24px rgba(44,44,44,0.08);
    --shadow-lg: 0 12px 48px rgba(44,44,44,0.14);
    --radius: 16px;
    --radius-sm: 10px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--charcoal); }

  .app { min-height: 100vh; }

  /* NAV */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(253,250,245,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 70px;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700;
    color: var(--terracotta);
    cursor: pointer;
  }
  .nav-logo span { color: var(--forest); }
  .nav-links { display: flex; gap: 0.5rem; align-items: center; }
  .nav-btn {
    padding: 0.5rem 1.2rem; border-radius: 50px;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; font-weight: 500; transition: all 0.2s;
    background: transparent; color: var(--charcoal);
  }
  .nav-btn:hover { background: var(--warm); }
  .nav-btn.active { background: var(--forest); color: white; }
  .fav-badge {
    background: var(--terracotta); color: white;
    border-radius: 50px; padding: 0.1rem 0.5rem;
    font-size: 0.75rem; margin-left: 0.3rem;
  }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, var(--forest) 0%, #1A3028 100%);
    padding: 5rem 2rem 4rem;
    text-align: center; position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .hero-paws {
    font-size: 4rem; margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 4rem);
    color: white; line-height: 1.2; margin-bottom: 1rem;
  }
  .hero h1 em { color: var(--gold); font-style: italic; }
  .hero p { color: rgba(255,255,255,0.75); font-size: 1.1rem; max-width: 500px; margin: 0 auto 2.5rem; }
  .hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--terracotta); color: white;
    padding: 0.9rem 2rem; border-radius: 50px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 4px 20px rgba(196,96,59,0.4);
  }
  .btn-primary:hover { background: var(--terracotta-light); transform: translateY(-2px); }
  .btn-outline {
    background: transparent; color: white;
    padding: 0.9rem 2rem; border-radius: 50px;
    border: 2px solid rgba(255,255,255,0.4);
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500;
    cursor: pointer; transition: all 0.25s;
  }
  .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.1); }

  /* STATS */
  .stats { display: flex; justify-content: center; gap: 0; background: var(--warm); }
  .stat-item {
    flex: 1; max-width: 200px; padding: 2rem 1.5rem; text-align: center;
    border-right: 1px solid var(--border);
  }
  .stat-item:last-child { border-right: none; }
  .stat-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; font-weight: 700; color: var(--terracotta);
  }
  .stat-label { font-size: 0.85rem; color: var(--muted); margin-top: 0.2rem; }

  /* FILTER BAR */
  .filter-bar {
    padding: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;
    align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
  }
  .search-wrap { position: relative; flex: 1; min-width: 240px; max-width: 340px; }
  .search-wrap input {
    width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
    border: 1.5px solid var(--border); border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    background: white; outline: none; transition: border 0.2s;
  }
  .search-wrap input:focus { border-color: var(--forest); }
  .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 1rem; }
  .filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .chip {
    padding: 0.45rem 1.1rem; border-radius: 50px;
    border: 1.5px solid var(--border); background: white;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; color: var(--charcoal);
  }
  .chip:hover { border-color: var(--forest); color: var(--forest); }
  .chip.active { background: var(--forest); color: white; border-color: var(--forest); }
  .results-count { color: var(--muted); font-size: 0.9rem; }

  /* PET GRID */
  .pet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1.5rem; padding: 2rem;
  }
  .pet-card {
    background: white; border-radius: var(--radius);
    border: 1.5px solid var(--border);
    overflow: hidden; cursor: pointer;
    transition: all 0.3s; position: relative;
  }
  .pet-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: transparent; }
  .pet-card-img {
    height: 180px; display: flex; align-items: center; justify-content: center;
    font-size: 5rem; position: relative;
    transition: transform 0.3s;
  }
  .pet-card:hover .pet-card-img { transform: scale(1.05); }
  .pet-card-status {
    position: absolute; top: 1rem; left: 1rem;
    padding: 0.3rem 0.8rem; border-radius: 50px;
    font-size: 0.75rem; font-weight: 600;
  }
  .status-available { background: #DCFCE7; color: #166534; }
  .status-pending { background: #FEF3C7; color: #92400E; }
  .pet-fav-btn {
    position: absolute; top: 1rem; right: 1rem;
    background: white; border: none; border-radius: 50%;
    width: 36px; height: 36px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; box-shadow: var(--shadow);
    transition: transform 0.2s;
  }
  .pet-fav-btn:hover { transform: scale(1.15); }
  .pet-card-body { padding: 1.25rem; }
  .pet-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem; font-weight: 700; margin-bottom: 0.2rem;
  }
  .pet-breed { color: var(--muted); font-size: 0.85rem; margin-bottom: 0.75rem; }
  .pet-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
  .pet-tag {
    padding: 0.25rem 0.7rem; border-radius: 50px;
    font-size: 0.75rem; font-weight: 500;
    background: var(--warm); color: var(--charcoal);
  }
  .pet-meta { display: flex; gap: 1rem; font-size: 0.82rem; color: var(--muted); }
  .pet-meta span::before { margin-right: 0.3rem; }
  .adopt-btn {
    width: 100%; margin-top: 1rem; padding: 0.7rem;
    background: var(--forest); color: white; border: none;
    border-radius: var(--radius-sm); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.9rem;
    transition: background 0.2s;
  }
  .adopt-btn:hover { background: var(--forest-light); }
  .adopt-btn:disabled { background: #ccc; cursor: not-allowed; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    backdrop-filter: blur(4px); z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; animation: fadeIn 0.2s;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal {
    background: white; border-radius: 24px;
    max-width: 580px; width: 100%; max-height: 90vh;
    overflow-y: auto; animation: slideUp 0.3s;
  }
  @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-hero {
    height: 200px; display: flex; align-items: center; justify-content: center;
    font-size: 7rem; border-radius: 24px 24px 0 0;
  }
  .modal-body { padding: 2rem; }
  .modal-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; }
  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700;
  }
  .modal-close {
    background: var(--warm); border: none; border-radius: 50%;
    width: 40px; height: 40px; cursor: pointer; font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .modal-desc { color: var(--muted); line-height: 1.7; margin-bottom: 1.5rem; }
  .modal-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
  .info-card { background: var(--cream); border-radius: var(--radius-sm); padding: 1rem; }
  .info-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
  .info-value { font-weight: 600; }
  .traits { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .trait { padding: 0.4rem 1rem; border-radius: 50px; background: var(--warm); font-size: 0.85rem; font-weight: 500; }
  .modal-actions { display: flex; gap: 1rem; }
  .modal-actions .btn-primary { flex: 1; border-radius: var(--radius-sm); }
  .modal-actions .btn-fav {
    padding: 0.9rem 1.2rem; border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); background: white; cursor: pointer;
    font-size: 1.3rem; transition: all 0.2s;
  }
  .modal-actions .btn-fav:hover { background: var(--warm); }

  /* FORM */
  .form-section { padding: 2rem; max-width: 700px; margin: 0 auto; }
  .form-section h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; margin-bottom: 0.5rem;
  }
  .form-section p { color: var(--muted); margin-bottom: 2rem; }
  .form-group { margin-bottom: 1.25rem; }
  .form-group label { display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.9rem; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%; padding: 0.8rem 1rem;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    background: white; outline: none; transition: border 0.2s; resize: vertical;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--forest); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-error { color: #DC2626; font-size: 0.8rem; margin-top: 0.3rem; }
  .submit-btn {
    width: 100%; padding: 1rem; background: var(--terracotta); color: white;
    border: none; border-radius: var(--radius-sm); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
    transition: all 0.25s; margin-top: 0.5rem;
  }
  .submit-btn:hover { background: var(--terracotta-light); transform: translateY(-1px); }

  /* FAVORITES */
  .favorites-section { padding: 2rem; }
  .favorites-section h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; margin-bottom: 0.5rem;
  }
  .favorites-section p { color: var(--muted); margin-bottom: 2rem; }
  .empty-state { text-align: center; padding: 4rem 2rem; color: var(--muted); }
  .empty-state .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
  .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--charcoal); margin-bottom: 0.5rem; }

  /* APPLICATIONS */
  .applications-section { padding: 2rem; max-width: 800px; margin: 0 auto; }
  .applications-section h2 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 0.5rem; }
  .applications-section p { color: var(--muted); margin-bottom: 2rem; }
  .app-card {
    background: white; border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 1.5rem; margin-bottom: 1rem;
    display: flex; align-items: center; gap: 1.5rem;
  }
  .app-pet-icon { font-size: 3rem; }
  .app-info { flex: 1; }
  .app-name { font-weight: 600; font-size: 1.05rem; margin-bottom: 0.2rem; }
  .app-date { font-size: 0.82rem; color: var(--muted); }
  .app-status {
    padding: 0.4rem 1rem; border-radius: 50px;
    font-size: 0.8rem; font-weight: 600;
    background: #DCFCE7; color: #166534;
  }

  /* TOAST */
  .toast-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 999; display: flex; flex-direction: column; gap: 0.75rem; }
  .toast {
    background: var(--charcoal); color: white;
    padding: 1rem 1.5rem; border-radius: var(--radius-sm);
    font-size: 0.9rem; animation: slideInRight 0.3s, fadeOut 0.3s 2.7s forwards;
    box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 0.75rem;
  }
  @keyframes slideInRight { from{transform:translateX(100px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes fadeOut { to{opacity:0;transform:translateX(20px)} }

  /* FOOTER */
  .footer { background: var(--forest); color: rgba(255,255,255,0.7); padding: 3rem 2rem; text-align: center; margin-top: 4rem; }
  .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: white; margin-bottom: 0.5rem; }
  .footer p { font-size: 0.9rem; }

  @media (max-width: 600px) {
    .stats { flex-wrap: wrap; }
    .stat-item { min-width: 45%; border-right: none; border-bottom: 1px solid var(--border); }
    .form-row { grid-template-columns: 1fr; }
    .modal-info-grid { grid-template-columns: 1fr; }
  }
`;

// ─── TOAST COMPONENT ─────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <span>{t.icon}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── PET CARD COMPONENT ───────────────────────────────────────────────────────
function PetCard({ pet, onSelect, onToggleFav, isFav }) {
  return (
    <div className="pet-card" onClick={() => onSelect(pet)}>
      <div className="pet-card-img" style={{ background: pet.bg }}>
        <span>{pet.img}</span>
        <span className={`pet-card-status status-${pet.status.toLowerCase()}`}>{pet.status}</span>
        <button
          className="pet-fav-btn"
          onClick={(e) => { e.stopPropagation(); onToggleFav(pet.id); }}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="pet-card-body">
        <div className="pet-name">{pet.name}</div>
        <div className="pet-breed">{pet.breed} · {pet.type}</div>
        <div className="pet-tags">
          {pet.personality.slice(0, 2).map((p) => (
            <span key={p} className="pet-tag">{p}</span>
          ))}
        </div>
        <div className="pet-meta">
          <span>🎂 {pet.age} yr</span>
          <span>⚥ {pet.gender}</span>
          <span>📏 {pet.size}</span>
        </div>
        <button
          className="adopt-btn"
          disabled={pet.status === "Pending"}
          onClick={(e) => { e.stopPropagation(); onSelect(pet); }}
        >
          {pet.status === "Pending" ? "Pending Adoption" : "Meet " + pet.name}
        </button>
      </div>
    </div>
  );
}

// ─── PET MODAL COMPONENT ──────────────────────────────────────────────────────
function PetModal({ pet, onClose, onAdopt, isFav, onToggleFav }) {
  // useEffect for keyboard escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-hero" style={{ background: pet.bg }}>
          {pet.img}
        </div>
        <div className="modal-body">
          <div className="modal-header">
            <div>
              <div className="modal-title">{pet.name}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{pet.breed} · {pet.type}</div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <p className="modal-desc">{pet.description}</p>
          <div className="modal-info-grid">
            {[["Age", `${pet.age} year${pet.age > 1 ? "s" : ""}`], ["Gender", pet.gender], ["Size", pet.size], ["Status", pet.status]].map(([label, value]) => (
              <div key={label} className="info-card">
                <div className="info-label">{label}</div>
                <div className="info-value">{value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "0.75rem", fontWeight: 500, fontSize: "0.9rem" }}>Personality</div>
          <div className="traits">
            {pet.personality.map((t) => <span key={t} className="trait">{t}</span>)}
          </div>
          <div className="modal-actions">
            <button
              className="btn-primary"
              style={{ borderRadius: "var(--radius-sm)" }}
              disabled={pet.status === "Pending"}
              onClick={() => onAdopt(pet)}
            >
              {pet.status === "Pending" ? "⏳ Pending" : "Apply to Adopt"}
            </button>
            <button className="modal-actions btn-fav" onClick={() => onToggleFav(pet.id)}>
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADOPTION FORM COMPONENT ──────────────────────────────────────────────────
function AdoptionForm({ pet, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", experience: "", reason: "" });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.reason.trim()) errs.reason = "Please share your reason";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, pet, date: new Date().toLocaleDateString() });
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-hero" style={{ background: pet.bg, height: 120 }}>{pet.img}</div>
        <div className="modal-body">
          <div className="modal-header">
            <div>
              <div className="modal-title" style={{ fontSize: "1.5rem" }}>Adoption Application</div>
              <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Applying for {pet.name} the {pet.breed}</div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input ref={nameRef} name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label>Prior Pet Experience</label>
              <select name="experience" value={form.experience} onChange={handleChange}>
                <option value="">Select experience</option>
                <option value="none">No prior pets</option>
                <option value="some">Some experience</option>
                <option value="experienced">Very experienced</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Home Address *</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, City, State" />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label>Why do you want to adopt {pet.name}? *</label>
            <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Tell us a bit about your lifestyle and why you'd be a great match..." />
            {errors.reason && <div className="form-error">{errors.reason}</div>}
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit Application 🐾</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────
function BrowsePage({ addToast }) {
  const { state, dispatch } = useContext(AdoptionContext);
  const [selectedPet, setSelectedPet] = useState(null);
  const [applyingFor, setApplyingFor] = useState(null);

  const toggleFav = useCallback((id) => {
    const isFav = state.favorites.includes(id);
    dispatch({ type: isFav ? "REMOVE_FAVORITE" : "ADD_FAVORITE", payload: id });
    addToast(isFav ? "Removed from favorites" : "Added to favorites! ❤️", isFav ? "💔" : "❤️");
  }, [state.favorites, dispatch, addToast]);

  const filteredPets = useMemo(() => {
    return PETS.filter((p) => {
      const matchesFilter = state.filter === "All" || p.type === state.filter;
      const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase()) ||
        p.breed.toLowerCase().includes(state.search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [state.filter, state.search]);

  const handleAdopt = (pet) => {
    setSelectedPet(null);
    setApplyingFor(pet);
  };

  const handleSubmitApp = (data) => {
    dispatch({ type: "SUBMIT_APPLICATION", payload: data });
    setApplyingFor(null);
    addToast(`Application for ${data.pet.name} submitted! 🎉`, "🐾");
  };

  return (
    <>
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            value={state.search}
            onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            placeholder="Search by name or breed..."
          />
        </div>
        <div className="filter-chips">
          {["All", "Dog", "Cat", "Bird", "Rabbit"].map((f) => (
            <button
              key={f}
              className={`chip ${state.filter === f ? "active" : ""}`}
              onClick={() => dispatch({ type: "SET_FILTER", payload: f })}
            >
              {f === "All" ? "🐾 All" : f === "Dog" ? "🐕 Dogs" : f === "Cat" ? "🐱 Cats" : f === "Bird" ? "🦜 Birds" : "🐰 Rabbits"}
            </button>
          ))}
        </div>
        <div className="results-count">{filteredPets.length} pets found</div>
      </div>
      <div className="pet-grid">
        {filteredPets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onSelect={setSelectedPet}
            onToggleFav={toggleFav}
            isFav={state.favorites.includes(pet.id)}
          />
        ))}
        {filteredPets.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <div className="empty-icon">🔍</div>
            <h3>No pets found</h3>
            <p>Try a different search or filter</p>
          </div>
        )}
      </div>
      {selectedPet && (
        <PetModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onAdopt={handleAdopt}
          isFav={state.favorites.includes(selectedPet.id)}
          onToggleFav={toggleFav}
        />
      )}
      {applyingFor && (
        <AdoptionForm
          pet={applyingFor}
          onClose={() => setApplyingFor(null)}
          onSubmit={handleSubmitApp}
        />
      )}
    </>
  );
}

function FavoritesPage({ addToast }) {
  const { state, dispatch } = useContext(AdoptionContext);
  const favPets = PETS.filter((p) => state.favorites.includes(p.id));
  const [selectedPet, setSelectedPet] = useState(null);

  const toggleFav = useCallback((id) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: id });
    addToast("Removed from favorites", "💔");
    if (selectedPet?.id === id) setSelectedPet(null);
  }, [dispatch, addToast, selectedPet]);

  return (
    <div className="favorites-section">
      <h2>Your Favorites ❤️</h2>
      <p>Pets you've saved for later.</p>
      {favPets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤍</div>
          <h3>No favorites yet</h3>
          <p>Browse pets and tap the heart to save them here.</p>
        </div>
      ) : (
        <div className="pet-grid">
          {favPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onSelect={setSelectedPet}
              onToggleFav={toggleFav}
              isFav={true}
            />
          ))}
        </div>
      )}
      {selectedPet && (
        <PetModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onAdopt={() => {}}
          isFav={state.favorites.includes(selectedPet.id)}
          onToggleFav={toggleFav}
        />
      )}
    </div>
  );
}

function ApplicationsPage() {
  const { state } = useContext(AdoptionContext);
  const petMap = Object.fromEntries(PETS.map((p) => [p.id, p]));

  return (
    <div className="applications-section">
      <h2>My Applications 📋</h2>
      <p>Track the status of your adoption applications.</p>
      {state.applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No applications yet</h3>
          <p>Find a pet you love and submit an adoption application.</p>
        </div>
      ) : (
        state.applications.map((app, i) => (
          <div key={i} className="app-card">
            <div className="app-pet-icon">{app.pet.img}</div>
            <div className="app-info">
              <div className="app-name">Application for {app.pet.name}</div>
              <div className="app-date">Submitted on {app.date} by {app.name}</div>
            </div>
            <div className="app-status">Under Review</div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("browse");
  const [toasts, setToasts] = useState([]);
  const [savedState, setSavedState] = useLocalStorage("petAdoptionState", {
    favorites: [], applications: [], filter: "All", search: ""
  });

  const [state, dispatch] = useReducer(adoptionReducer, savedState);

  // Sync reducer state to localStorage
  useEffect(() => { setSavedState(state); }, [state]);

  const addToast = useCallback((message, icon = "✅") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <AdoptionContext.Provider value={{ state, dispatch }}>
      <style>{css}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("browse")}>
            Paw<span>Match</span>
          </div>
          <div className="nav-links">
            {[["browse", "🐾 Browse"], ["favorites", "❤️ Saved"], ["applications", "📋 Applications"]].map(([key, label]) => (
              <button
                key={key}
                className={`nav-btn ${page === key ? "active" : ""}`}
                onClick={() => setPage(key)}
              >
                {label}
                {key === "favorites" && state.favorites.length > 0 && (
                  <span className="fav-badge">{state.favorites.length}</span>
                )}
                {key === "applications" && state.applications.length > 0 && (
                  <span className="fav-badge">{state.applications.length}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* HERO (only on browse) */}
        {page === "browse" && (
          <>
            <section className="hero">
              <div className="hero-paws">🐾</div>
              <h1>Find Your <em>Perfect</em><br />Companion</h1>
              <p>Every pet deserves a loving home. Browse hundreds of adoptable animals waiting for a family just like yours.</p>
              <div className="hero-cta">
                <button className="btn-primary" onClick={() => document.querySelector(".filter-bar")?.scrollIntoView({ behavior: "smooth" })}>
                  Browse Pets
                </button>
                <button className="btn-outline">Learn About Adoption</button>
              </div>
            </section>
            <div className="stats">
              {STATS.map((s) => (
                <div key={s.label} className="stat-item">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAGES */}
        {page === "browse" && <BrowsePage addToast={addToast} />}
        {page === "favorites" && <FavoritesPage addToast={addToast} />}
        {page === "applications" && <ApplicationsPage />}

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">🐾 PawMatch</div>
          <p>Connecting pets with loving families since 2020. Made with ❤️ for every animal.</p>
        </footer>

        <Toast toasts={toasts} />
      </div>
    </AdoptionContext.Provider>
  );
}
