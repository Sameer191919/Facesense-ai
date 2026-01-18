import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import { getProfile, updateProfile } from "../services/profileApi";

export default function UserProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  /* ---------------- UI STATE ---------------- */
  const [darkMode, setDarkMode] = useState(false);
  const [editing, setEditing] = useState(false);

  /* ---------------- PROFILE STATE ---------------- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    getProfile()
      .then(res => {
        const p = res.data || {};
        setName(p.name || "");
        setEmail(p.email || "");
        setRole(p.role || "User");
        setStatus(p.status || "Active");
        setPhoto(p.photo ? `data:image/jpeg;base64,${p.photo}` : "");
      })
      .catch(() => alert("Failed to load profile"));
  }, []);

  /* ---------------- PHOTO CHANGE ---------------- */
  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const saveProfile = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (photoFile) formData.append("photo", photoFile);

    try {
      await updateProfile(formData);
      setEditing(false);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    }
  };

  return (
    <div className={`${darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-100 text-slate-900"} min-h-screen`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>

        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl p-8">
          {/* ================= TOP ================= */}
          <div className="flex items-center gap-6 mb-10">
            {/* AVATAR */}
            <div className="relative group">
              <div className="h-28 w-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-1 shadow-lg group-hover:scale-105 transition">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden text-3xl font-bold text-white">
                  {photo ? (
                    <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* ONLINE DOT */}
              <span className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 border-2 border-slate-900 rounded-full" />

              {/* EDIT BUTTON */}
              {editing && (
                <button
                  onClick={() => fileRef.current.click()}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
                >
                  Change Photo
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoChange}
              />
            </div>

            {/* INFO */}
            <div>
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-sm text-slate-400">{email}</p>
              <span className="inline-block mt-2 px-4 py-1 text-xs rounded-full bg-green-600 text-white">
                {status}
              </span>
            </div>
          </div>

          {/* ================= FORM ================= */}
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Full Name" value={name} disabled={!editing} onChange={e => setName(e.target.value)} />
            <Field label="Email Address" value={email} disabled={!editing} onChange={e => setEmail(e.target.value)} />
            <Field label="Role" value={role} disabled />
            <Field label="Account Status" value={status} disabled />
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex flex-wrap gap-4 mt-10">
            {!editing ? (
              <PrimaryButton onClick={() => setEditing(true)}>
                Edit Profile
              </PrimaryButton>
            ) : (
              <>
                <SuccessButton onClick={saveProfile}>
                  Save Changes
                </SuccessButton>
                <SecondaryButton onClick={() => setEditing(false)}>
                  Cancel
                </SecondaryButton>
              </>
            )}

            <MutedButton onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </MutedButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */
function Field({ label, value, disabled, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-slate-500">{label}</label>
      <input
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full p-3 rounded-lg border transition ${
          disabled
            ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500"
            : "bg-white dark:bg-slate-900 border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        }`}
      />
    </div>
  );
}

/* ================= BUTTONS ================= */
const baseBtn =
  "px-6 py-3 rounded-lg font-medium transition transform hover:scale-105 active:scale-95";

function PrimaryButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={`${baseBtn} bg-indigo-600 hover:bg-indigo-700 text-white`}>
      {children}
    </button>
  );
}

function SuccessButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={`${baseBtn} bg-green-600 hover:bg-green-700 text-white`}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={`${baseBtn} bg-slate-600 hover:bg-slate-700 text-white`}>
      {children}
    </button>
  );
}

function MutedButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={`${baseBtn} bg-slate-800 hover:bg-black text-white`}>
      {children}
    </button>
  );
}
