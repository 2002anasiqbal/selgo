"use client";
import Link from "next/link";
import useAuthStore from "@/store/store";
import authService from "@/services/authService";

const ProfileBar = () => {
  const { user } = useAuthStore();

  const handleSendEmailVerification = async () => {
    try {
      await authService.sendEmailVerification();
      alert("Verification email sent!");
    } catch (error) {
      alert("Failed to send verification email.");
    }
  };

  const handleSendPhoneVerification = async () => {
    try {
      await authService.sendPhoneVerification();
      alert("Verification SMS sent!");
    } catch (error) {
      alert("Failed to send verification SMS.");
    }
  };

  return (
    <div className="flex items-center justify-between py-4 bg-white w-full">
      {/* Profile Info */}
      <div className="flex items-center gap-4">
        <img
          src={user?.avatar_url || "/assets/profile/1.svg"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg text-gray-900 font-semibold">{user?.full_name || user?.username}</h3>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user?.is_email_verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {user?.is_email_verified ? "Email Verified" : "Email Not Verified"}
              </span>
              {!user?.is_email_verified && (
                <button onClick={handleSendEmailVerification} className="ml-2 text-xs text-blue-600 hover:underline">Resend</button>
              )}
            </div>
            <div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user?.is_phone_verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {user?.is_phone_verified ? "Phone Verified" : "Phone Not Verified"}
              </span>
              {!user?.is_phone_verified && user?.phone && (
                <button onClick={handleSendPhoneVerification} className="ml-2 text-xs text-blue-600 hover:underline">Resend</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <Link href="/routes/profile/form">
        <button className="px-4 py-2 bg-teal-500 text-white text-sm rounded-md hover:bg-teal-600 transition">
          Edit Profile
        </button>
      </Link>
    </div>
  );
};

export default ProfileBar;