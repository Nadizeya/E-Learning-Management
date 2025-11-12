import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/StudentHome.css";
import { studentAPI } from "../../services/api.js";

export default function StudentSettings() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!userRaw) {
      navigate("/student/signin");
      return;
    }
    try {
      const u = JSON.parse(userRaw);
      setStudent(u);
      setFirstName(u.firstName || "");
      setLastName(u.lastName || "");
      setEmail(u.email || "");
      if (token && userRole === "STUDENT" && userRaw) {
        setIsLoggedIn(true);
      }
    } catch {
      navigate("/student/signin");
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!student?.id && !student?.studentId) {
      setError("Missing student id in local storage");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const id = student.id || student.studentId;
      const res = await apiClient.put(`/students/${id}`, {
        firstName,
        lastName,
        email,
      });
      const updated = res.data;
      localStorage.setItem("user", JSON.stringify(updated));
      setStudent(updated);
      setMessage("Profile updated");
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    // Check if confirmation text matches
    if (deleteConfirmText !== "DELETE") {
      setError("Please type DELETE to confirm account deletion");
      return;
    }
    
    if (!student?.id && !student?.studentId) {
      setError("Missing student id in local storage");
      return;
    }
    
    setDeleteLoading(true);
    setError("");
    
    try {
      const id = student.id || student.studentId;
      await studentAPI.deleteStudent(id);
      
      // Clear all local storage data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      
      // Redirect to home page with a message
      navigate("/", { 
        state: { 
          message: "Your account has been successfully deleted. We're sorry to see you go!" 
        } 
      });
    } catch (err) {
      setError(err?.message || "Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };
  
  const toggleDeleteConfirm = () => {
    setShowDeleteConfirm(!showDeleteConfirm);
    setDeleteConfirmText("");
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa" }}>
      {/* Match StudentHome header/navbar */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top  ${
          isScrolled ? "navbar-scrolled" : ""
        }`}
        style={{ background: "#4041D2" }}
      >
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="/">
            <span className="brand-icon">🎓</span>
            LearnHub
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Explore
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  My Learning
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Career Goals
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              {isLoggedIn ? (
                <div className="user-dropdown-wrapper">
                  <div
                    className="user-profile-button"
                    onClick={() => setShowSignInDropdown(!showSignInDropdown)}
                  >
                    <div className="user-avatar">
                      <span>{student?.firstName?.charAt(0) || "H"}</span>
                    </div>
                    <span className="user-name d-none d-md-inline">
                      Hi, {student?.firstName || "Hello"}!
                    </span>
                  </div>

                  {showSignInDropdown && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">
                          {student?.firstName} {student?.lastName}
                        </div>
                        <div className="user-dropdown-email">
                          {student?.email}
                        </div>
                      </div>

                      <div className="user-dropdown-menu">
                        <Link
                          to="/student/settings"
                          className="dropdown-item"
                          onClick={() => setShowSignInDropdown(false)}
                        >
                          <span className="dropdown-item-icon">⚙️</span>{" "}
                          Settings
                        </Link>
                        <Link
                          to="/my-courses"
                          className="dropdown-item"
                          onClick={() => setShowSignInDropdown(false)}
                        >
                          <span className="dropdown-item-icon">📚</span> My
                          Courses
                        </Link>
                        <Link
                          to="/accomplishments"
                          className="dropdown-item"
                          onClick={() => setShowSignInDropdown(false)}
                        >
                          <span className="dropdown-item-icon">🏆</span>{" "}
                          Accomplishments
                        </Link>
                        <Link
                          to="/forgot-password?role=STUDENT"
                          className="dropdown-item"
                          onClick={() => setShowSignInDropdown(false)}
                        >
                          <span className="dropdown-item-icon">🔒</span> Change
                          Password
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button
                          className="dropdown-item dropdown-item-logout"
                          onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            localStorage.removeItem("userRole");
                            setIsLoggedIn(false);
                            setStudent(null);
                            setShowSignInDropdown(false);
                            navigate("/");
                          }}
                        >
                          <span className="dropdown-item-icon">🚪</span> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="signin-dropdown-wrapper">
                  <button
                    className="btn btn-signin-nav"
                    onClick={() => setShowSignInDropdown(!showSignInDropdown)}
                  >
                    Sign In
                    <span className="dropdown-arrow">
                      {showSignInDropdown ? "▲" : "▼"}
                    </span>
                  </button>
                  {showSignInDropdown && (
                    <div className="signin-dropdown">
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/student/signin")}
                      >
                        <span className="item-icon">👨‍🎓</span>
                        Sign in as Student
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate("/instructor/signin")}
                      >
                        <span className="item-icon">👨‍🏫</span>
                        Sign in as Instructor
                      </button>
                    </div>
                  )}
                </div>
              )}
              <Link to="/signin" className="btn btn-outline-light">
                Admin Sign In
              </Link>
              <Link to="/admin" className="btn btn-primary">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main
        className="container "
        style={{ paddingTop: 96, paddingBottom: 32 }}
      >
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="mt-5">Settings</h2>
                <small className="text-muted">
                  Manage your profile, security and achievements
                </small>
              </div>
              <div className="d-none d-md-flex align-items-center gap-2 text-muted">
                <span className="badge bg-light text-dark">
                  {student?.email || ""}
                </span>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}

            <div className="row g-4">
              <div className="col-12 col-xl-8">
                <div
                  className="card"
                  style={{
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title mb-3">Profile</h5>
                    <p className="text-muted mb-4" style={{ fontSize: 14 }}>
                      Update your name and email. Your email is used for login
                      and notifications.
                    </p>
                    <form onSubmit={saveProfile}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="firstName" className="form-label">
                            First name
                          </label>
                          <input
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label">
                            Last name
                          </label>
                          <input
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label htmlFor="email" className="form-label">
                            Email address
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4 d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setFirstName(student?.firstName || "");
                            setLastName(student?.lastName || "");
                            setEmail(student?.email || "");
                          }}
                          disabled={loading}
                        >
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="card mb-4" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h6 className="card-title">Security</h6>
                    <p className="text-muted" style={{ fontSize: 14 }}>
                      Change your password using the recovery flow.
                    </p>
                    <Link
                      to="/forgot-password?role=STUDENT"
                      className="btn btn-outline-primary w-100"
                    >
                      Change password
                    </Link>
                  </div>
                </div>

                <div className="card" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h6 className="card-title">Achievements</h6>
                    <p className="text-muted" style={{ fontSize: 14 }}>
                      View and download your certificates and badges.
                    </p>
                    <Link to="/accomplishments" className="btn btn-light w-100">
                      View achievements
                    </Link>
                  </div>
                </div>
                
                {/* Delete Account Card */}
                <div className="card mt-4" style={{ borderRadius: 16, borderColor: showDeleteConfirm ? '#dc3545' : null }}>
                  <div className="card-body">
                    <h6 className="card-title text-danger">Delete Account</h6>
                    <p className="text-muted" style={{ fontSize: 14 }}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button 
                        onClick={toggleDeleteConfirm}
                        className="btn btn-outline-danger w-100"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div>
                        <div className="alert alert-danger" role="alert">
                          <h6 className="alert-heading">Warning: This action cannot be undone!</h6>
                          <p className="mb-0" style={{ fontSize: 14 }}>
                            Deleting your account will permanently remove all your data, including:
                          </p>
                          <ul className="mt-2 mb-0" style={{ fontSize: 14 }}>
                            <li>Course enrollments</li>
                            <li>Progress tracking</li>
                            <li>Certificates and badges</li>
                            <li>Personal information</li>
                          </ul>
                        </div>
                        
                        <div className="form-group mt-3">
                          <label htmlFor="deleteConfirm" className="form-label">
                            Type <strong>DELETE</strong> to confirm:
                          </label>
                          <input
                            id="deleteConfirm"
                            className="form-control"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="DELETE"
                          />
                        </div>
                        
                        <div className="d-flex gap-2 mt-3">
                          <button
                            onClick={handleDeleteAccount}
                            className="btn btn-danger flex-grow-1"
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : "Confirm Delete"}
                          </button>
                          <button
                            onClick={toggleDeleteConfirm}
                            className="btn btn-outline-secondary"
                            disabled={deleteLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
