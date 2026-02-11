import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profile() {

  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Profile Settings
      </h1>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">

        {/* Profile Photo Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {photo ? (
              <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No Photo
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Change Profile Photo
            </label>
            <input type="file" onChange={handlePhotoChange} />
          </div>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Full Name</label>
          <input
            className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
            defaultValue="Sameer Shaik"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Email</label>
          <input
            className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
            defaultValue="sameer@email.com"
          />
        </div>

        {/* Interview Preference */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Preferred Interview Type
          </label>
          <select className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white">
            <option>HR</option>
            <option>Technical</option>
          </select>
        </div>

        {/* Change Password */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Change Password
          </label>
          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 rounded-lg dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between mb-8">
          <span className="font-semibold">Email Notifications</span>
          <input type="checkbox" className="w-5 h-5" />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">

          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}
