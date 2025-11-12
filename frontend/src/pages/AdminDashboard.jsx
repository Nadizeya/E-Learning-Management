import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../state/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import Modal from "../components/admin/Modal.jsx";
import DataTable from "../components/admin/DataTable.jsx";
import DetailSection from "../components/admin/DetailSection.jsx";
import ListGroupItem from "../components/admin/ListGroupItem.jsx";
import { useDataFetch } from "../hooks/useDataFetch.js";
import DetailModal from "../components/admin/DetailModal.jsx";
import RowActionMenu from "../components/admin/RowActionMenu.jsx";
import { formatDate } from "../utils/format.js";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("admins");

  useEffect(() => {
    if (!admin) navigate("/admin/login");
  }, [admin, navigate]);

  useEffect(() => {
    const onLogout = () => {
      logout();
      navigate("/admin/login");
    };
    document.addEventListener("topbar:logout", onLogout);
    return () => {
      document.removeEventListener("topbar:logout", onLogout);
    };
  }, [logout, navigate]);

  return (
    <div className="d-flex admin-dashboard-container">
      <Sidebar active={tab} onSelect={setTab} />
      <div className="flex-grow-1 d-flex flex-column admin-dashboard-content">
        <Topbar title="E‑Learning Management System" admin={admin} />
        <div className="detail-container container-fluid p-5">
          {tab === "admins" && <AdminsTab />}
          {tab === "courses" && <CoursesTab />}
          {tab === "students" && <StudentsTab />}
          {tab === "instructors" && <InstructorsTab />}
          {tab === "enrollment" && <EnrollmentTab />}
        </div>
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <h5 className="card-title text-info">{title}</h5>
        <p className="card-text text-secondary mb-0">
          APIs not wired yet. Coming soon.
        </p>
      </div>
    </div>
  );
}

function AdminsTab() {
  const { data: list, loading, error, refetch } = useDataFetch("/admins");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [deleteState, setDeleteState] = useState({
    id: null,
    reason: "",
    open: false,
  });
  const [editState, setEditState] = useState({
    open: false,
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    permissions: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const createAdmin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await apiClient.post("/admins", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        permissions: "all",
      });
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      refetch();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to create admin");
    }
  };

  const performDelete = async () => {
    if (!deleteState.id) return;
    try {
      await apiClient.delete(`/admins/${deleteState.id}`, {
        data: { reason: deleteState.reason },
      });
      setDeleteState({ id: null, reason: "", open: false });
      refetch();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/admins/${editState.id}`, {
        firstName: editState.firstName,
        lastName: editState.lastName,
        email: editState.email,
        password: "",
        permissions: editState.permissions || "all",
      });
      setEditState({
        open: false,
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        permissions: "",
      });
      refetch();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to update admin");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (a) => `${a.firstName} ${a.lastName}`,
    },
    { key: "email", label: "Email" },
    {
      key: "createdAt",
      label: "Created at",
      render: (a) => formatDate(a.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (a) => (
        <RowActionMenu
          placement="right"
          onEdit={() =>
            setEditState({
              open: true,
              id: a.adminId || a.id,
              firstName: a.firstName || "",
              lastName: a.lastName || "",
              email: a.email || "",
              permissions: a.permissions || "",
            })
          }
          onDelete={() =>
            setDeleteState({ id: a.adminId || a.id, reason: "", open: true })
          }
        />
      ),
    },
  ];

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title m-0 text-info">Admins List</h5>
          <button
            className="btn btn-info text-white"
            onClick={() => setCreateOpen(true)}
          >
            Create
          </button>
        </div>
        {(error || errorMsg) && (
          <div className="alert alert-danger" role="alert">
            {error || errorMsg}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={list}
            emptyMessage="No admins found"
          />
        )}

        <Modal
          show={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Create Admin"
        >
          <div className="modal-body">
            <form className="row g-2" onSubmit={createAdmin}>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-info text-white" onClick={createAdmin}>
              Create
            </button>
          </div>
        </Modal>

        <Modal
          show={deleteState.open}
          onClose={() => setDeleteState({ id: null, reason: "", open: false })}
          title="Delete Admin"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              value={deleteState.reason}
              onChange={(e) =>
                setDeleteState({ ...deleteState, reason: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteState({ id: null, reason: "", open: false })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={performDelete}
              disabled={!deleteState.reason.trim()}
            >
              Delete
            </button>
          </div>
        </Modal>

        <Modal
          show={editState.open}
          onClose={() =>
            setEditState({
              open: false,
              id: null,
              firstName: "",
              lastName: "",
              email: "",
              permissions: "",
            })
          }
          title="Edit Admin"
        >
          <div className="modal-body">
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="First name"
                  value={editState.firstName}
                  onChange={(e) =>
                    setEditState({ ...editState, firstName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Last name"
                  value={editState.lastName}
                  onChange={(e) =>
                    setEditState({ ...editState, lastName: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Email"
                  type="email"
                  value={editState.email}
                  onChange={(e) =>
                    setEditState({ ...editState, email: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  placeholder="Permissions"
                  value={editState.permissions}
                  onChange={(e) =>
                    setEditState({ ...editState, permissions: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setEditState({
                  open: false,
                  id: null,
                  firstName: "",
                  lastName: "",
                  email: "",
                  permissions: "",
                })
              }
            >
              Cancel
            </button>
            <button className="btn btn-info text-white" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </Modal>

        {/* No full admin details modal for now */}
      </div>
    </div>
  );
}

function StudentsTab() {
  const { data: list, loading, error, refetch } = useDataFetch("/students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [details, setDetails] = useState({
    certificates: [],
    badges: [],
    enrollments: [],
    courses: [],
    loading: false,
  });
  const [deleteState, setDeleteState] = useState({
    id: null,
    open: false,
    reason: "",
  });

  const fetchStudentDetails = async (studentId) => {
    setDetails({
      certificates: [],
      badges: [],
      enrollments: [],
      courses: [],
      loading: true,
    });
    try {
      const studentRes = await apiClient.get(`/students/${studentId}`);
      const student = studentRes.data;

      let enrollments = [],
        courses = [];
      try {
        const enrollmentRes = await apiClient.get(
          `/enrollments/student/${studentId}`
        );
        enrollments = enrollmentRes.data?.data || [];
        courses = await Promise.all(
          enrollments.map((e) =>
            apiClient
              .get(`/courses/${e.courseId}`)
              .then((r) => r.data?.data || null)
              .catch(() => null)
          )
        );
      } catch (e) {
        console.error("Failed to load enrollments:", e);
      }

      let certificates = [];
      try {
        const certRes = await apiClient.get(
          `/certificates/student/${studentId}`
        );
        certificates = certRes.data?.data || certRes.data || [];
      } catch (e) {
        console.log("Certificates API not available yet");
      }

      let badges = [];
      try {
        const badgeRes = await apiClient.get(`/badges/student/${studentId}`);
        badges = badgeRes.data?.data || badgeRes.data || [];
      } catch (e) {
        console.log("Badges API not available yet");
      }

      setDetails({
        certificates,
        badges,
        enrollments,
        courses,
        loading: false,
      });
      setSelectedStudent(student);
    } catch (e) {
      console.error(e);
      setDetails({
        certificates: [],
        badges: [],
        enrollments: [],
        courses: [],
        loading: false,
      });
    }
  };

  const columns = [
    {
      key: "name",
      label: "Full name",
      render: (s) => `${s.firstName} ${s.lastName}`,
    },
    { key: "email", label: "Email" },
    {
      key: "studentId",
      label: "Student Id",
      render: (s) => s.id || s.studentId || "N/A",
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (s) => formatDate(s.createdAt || s.created_at),
    },
    {
      key: "updatedAt",
      label: "Updated at",
      render: (s) => formatDate(s.updatedAt || s.updated_at),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (s) => (
        <RowActionMenu
          placement="right"
          onDelete={() => setDeleteState({ id: s.id, open: true, reason: "" })}
        />
      ),
    },
  ];

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <h5 className="card-title m-0 text-info mb-3">Students List</h5>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={list}
            onRowClick={(s) => fetchStudentDetails(s.id)}
            emptyMessage="No students found"
          />
        )}

        <DetailModal
          show={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={
            `${selectedStudent?.firstName ?? ""} ${
              selectedStudent?.lastName ?? ""
            }`.trim() || "Student"
          }
          loading={details.loading}
        >
          <DetailSection label="1. Achievements">
            <div className="mt-3">
              <h6 className="fw-semibold">1.1 Certificates</h6>
              {details.certificates.length > 0 ? (
                <div className="list-group">
                  {details.certificates.map((cert, idx) => (
                    <div key={idx} className="list-group-item">
                      <div>
                        <strong>
                          {cert.courseTitle ||
                            `Certificate ${cert.certificateId || idx + 1}`}
                        </strong>
                        {cert.uniqueCode && (
                          <div className="text-muted small">
                            Code: {cert.uniqueCode}
                          </div>
                        )}
                        {cert.issueDate && (
                          <div className="text-muted small">
                            Issued:{" "}
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No certificates earned yet.</p>
              )}
            </div>
            <div className="mt-3">
              <h6 className="fw-semibold">1.2 Badges</h6>
              {details.badges.length > 0 ? (
                <div className="list-group">
                  {details.badges.map((badge, idx) => (
                    <div key={idx} className="list-group-item">
                      <div className="d-flex align-items-center">
                        {badge.iconUrl && (
                          <img
                            src={badge.iconUrl}
                            alt={badge.name}
                            className="badge-icon"
                          />
                        )}
                        <div>
                          <strong>
                            {badge.name || `Badge ${badge.badgeId || idx + 1}`}
                          </strong>
                          {badge.description && (
                            <div className="text-muted small">
                              {badge.description}
                            </div>
                          )}
                          {badge.earnedAt && (
                            <div className="text-muted small">
                              Earned:{" "}
                              {new Date(badge.earnedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No badges earned yet.</p>
              )}
            </div>
          </DetailSection>
          <DetailSection label="2. Enrolled Courses">
            {details.enrollments.length > 0 ? (
              <div className="list-group mt-2">
                {details.enrollments.map((enrollment, idx) => {
                  const course = details.courses[idx];
                  return (
                    <ListGroupItem
                      key={enrollment.enrollmentId || idx}
                      title={
                        course?.title || `Course ID: ${enrollment.courseId}`
                      }
                      description={course?.description}
                      badge={enrollment.completionStatus || "In Progress"}
                      badgeVariant={
                        enrollment.completionStatus === "Completed"
                          ? "success"
                          : "warning"
                      }
                      extra={
                        enrollment.enrollmentDate && (
                          <span className="text-muted small ms-2">
                            Enrolled:{" "}
                            {new Date(
                              enrollment.enrollmentDate
                            ).toLocaleDateString()}
                          </span>
                        )
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <p className="empty-state">No enrolled courses.</p>
            )}
          </DetailSection>
        </DetailModal>

        <Modal
          show={deleteState.open}
          onClose={() => setDeleteState({ id: null, open: false, reason: "" })}
          title="Delete Student"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              rows={3}
              value={deleteState.reason}
              onChange={(e) =>
                setDeleteState({ ...deleteState, reason: e.target.value })
              }
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteState({ id: null, open: false, reason: "" })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await apiClient.delete(`/students/${deleteState.id}`, {
                    data: { reason: deleteState.reason },
                  });
                  setDeleteState({ id: null, open: false, reason: "" });
                  refetch();
                } catch (e) {
                  alert("Failed to delete");
                }
              }}
              disabled={!deleteState.reason.trim()}
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function InstructorsTab() {
  const { data: list, loading, error, refetch } = useDataFetch("/instructors");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [details, setDetails] = useState({ courses: [], loading: false });
  const [deleteState, setDeleteState] = useState({
    id: null,
    open: false,
    reason: "",
  });

  const fetchInstructorDetails = async (instructorId) => {
    setDetails({ courses: [], loading: true });
    try {
      const instructorRes = await apiClient.get(`/instructors/${instructorId}`);
      const instructor = instructorRes.data;
      let courses = [];
      try {
        const coursesRes = await apiClient.get(
          `/courses/instructor/${instructorId}`
        );
        courses = coursesRes.data?.data || [];
      } catch (e) {
        console.error("Failed to load courses:", e);
      }
      setDetails({ courses, loading: false });
      setSelectedInstructor(instructor);
    } catch (e) {
      console.error(e);
      setDetails({ courses: [], loading: false });
    }
  };

  const columns = [
    {
      key: "name",
      label: "Full name",
      render: (i) => `${i.firstName} ${i.lastName}`,
    },
    { key: "email", label: "Email" },
    {
      key: "instructorId",
      label: "Instructor Id",
      render: (i) => i.id || i.instructorId || "N/A",
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (i) => formatDate(i.createdAt || i.created_at),
    },
    {
      key: "updatedAt",
      label: "Updated at",
      render: (i) => formatDate(i.updatedAt || i.updated_at),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (i) => (
        <RowActionMenu
          placement="right"
          onDelete={() => setDeleteState({ id: i.id, open: true, reason: "" })}
        />
      ),
    },
  ];

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <h5 className="card-title m-0 text-info mb-3">Instructors List</h5>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={list}
            onRowClick={(i) => fetchInstructorDetails(i.id)}
            emptyMessage="No instructors found"
          />
        )}

        <DetailModal
          show={!!selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          title={
            `${selectedInstructor?.firstName ?? ""} ${
              selectedInstructor?.lastName ?? ""
            }`.trim() || "Instructor"
          }
          loading={details.loading}
        >
          <DetailSection label="1. Bio">
            <p className="form-control-plaintext">
              {selectedInstructor?.bio || "N/A"}
            </p>
          </DetailSection>
          <DetailSection label="2. Expertise">
            <p className="form-control-plaintext">
              {selectedInstructor?.expertise || "N/A"}
            </p>
          </DetailSection>
          <DetailSection label="3. Created Courses">
            {details.courses.length > 0 ? (
              <div className="list-group mt-2">
                {details.courses.map((course) => (
                  <ListGroupItem
                    key={course.courseId}
                    title={course.title}
                    description={course.description}
                    badge={course.status || "Draft"}
                    badgeVariant={
                      course.status === "Published" ? "success" : "secondary"
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="empty-state">No courses created yet.</p>
            )}
          </DetailSection>
        </DetailModal>

        <Modal
          show={deleteState.open}
          onClose={() => setDeleteState({ id: null, open: false, reason: "" })}
          title="Delete Instructor"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              rows={3}
              value={deleteState.reason}
              onChange={(e) =>
                setDeleteState({ ...deleteState, reason: e.target.value })
              }
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteState({ id: null, open: false, reason: "" })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await apiClient.delete(`/instructors/${deleteState.id}`, {
                    data: { reason: deleteState.reason },
                  });
                  setDeleteState({ id: null, open: false, reason: "" });
                  refetch();
                } catch (e) {
                  alert("Failed to delete");
                }
              }}
              disabled={!deleteState.reason.trim()}
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function CoursesTab() {
  const { data: list, loading, error, refetch } = useDataFetch("/courses");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [details, setDetails] = useState({
    instructor: null,
    enrollments: [],
    category: null,
    loading: false,
  });
  const [editCourse, setEditCourse] = useState({
    open: false,
    id: null,
    title: "",
  }); // will be removed
  const [deleteCourse, setDeleteCourse] = useState({
    id: null,
    open: false,
    reason: "",
  });
  const [modules, setModules] = useState({
    open: false,
    list: [],
    loading: false,
  });
  const [categories, setCategories] = useState([]);

  // Fetch all categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiClient.get("/categories");
        const categories =
          categoriesData.data?.data || categoriesData.data || [];
        console.log("Fetched categories:", categories);
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchCourseDetails = async (courseId) => {
    setDetails({
      instructor: null,
      enrollments: [],
      category: null,
      loading: true,
    });
    try {
      const courseRes = await apiClient.get(`/courses/${courseId}`);
      const course = courseRes.data?.data || courseRes.data;

      let instructor = null;
      if (course.instructorId) {
        try {
          const instructorRes = await apiClient.get(
            `/instructors/${course.instructorId}`
          );
          instructor = instructorRes.data;
        } catch (e) {
          console.error("Failed to load instructor:", e);
        }
      }

      let enrollments = [];
      try {
        const enrollmentRes = await apiClient.get(
          `/enrollments/course/${courseId}`
        );
        enrollments = enrollmentRes.data?.data || [];
      } catch (e) {
        console.error("Failed to load enrollments:", e);
      }

      // Find category information if course has categoryId
      let category = null;
      if (course.categoryId) {
        category = categories.find(
          (cat) =>
            cat.id === course.categoryId || cat.categoryId === course.categoryId
        );
        if (!category) {
          try {
            const categoryRes = await apiClient.get(
              `/categories/${course.categoryId}`
            );
            category = categoryRes.data?.data || categoryRes.data;
          } catch (e) {
            console.error("Failed to load category:", e);
          }
        }
      }

      setDetails({ instructor, enrollments, category, loading: false });
      setSelectedCourse(course);
    } catch (e) {
      console.error(e);
      setDetails({
        instructor: null,
        enrollments: [],
        category: null,
        loading: false,
      });
    }
  };

  const columns = [
    { key: "title", label: "Course name" },
    {
      key: "courseId",
      label: "Course Id",
      render: (c) => c.courseId || c.id || "N/A",
    },
    {
      key: "category",
      label: "Category",
      render: (c) => {
        if (!c.categoryId) return "N/A";
        const category = categories.find(
          (cat) => cat.id === c.categoryId || cat.categoryId === c.categoryId
        );
        return category ? category.name : c.categoryType || "N/A";
      },
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (c) => (c.instructorId ? `Instructor #${c.instructorId}` : "N/A"),
    },
    { key: "status", label: "Status", render: (c) => c.status || "N/A" },
    { key: "duration", label: "Duration", render: (c) => c.duration || "N/A" },
    {
      key: "createdAt",
      label: "Created at",
      render: (c) => formatDate(c.createdAt),
    },
    {
      key: "updatedAt",
      label: "Updated at",
      render: (c) => formatDate(c.updatedAt),
    },
    {
      key: "actions",
      label: "Actions",
      align: "end",
      render: (c) => (
        <RowActionMenu
          placement="right"
          onDelete={() =>
            setDeleteCourse({ id: c.courseId || c.id, open: true, reason: "" })
          }
        />
      ),
    },
  ];
  const completedCount = details.enrollments.filter(
    (e) => e.completionStatus === "Completed"
  ).length;
  const enrolledCount = details.enrollments.length;

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <h5 className="card-title m-0 text-info mb-3">Courses List</h5>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={list}
            onRowClick={(c) => fetchCourseDetails(c.courseId)}
            emptyMessage="No courses found"
          />
        )}

        <DetailModal
          show={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse?.title || "Course"}
          loading={details.loading}
        >
          <DetailSection label="1. Category">
            <p className="form-control-plaintext fs-5">
              {details.category
                ? details.category.name
                : selectedCourse?.categoryType || "N/A"}
            </p>
            {details.category && details.category.description && (
              <p className="form-control-plaintext text-muted">
                {details.category.description}
              </p>
            )}
          </DetailSection>
          <DetailSection label="2. Created By">
            <p className="form-control-plaintext fs-5">
              {details.instructor
                ? `${details.instructor.firstName} ${details.instructor.lastName}`
                : "N/A"}
            </p>
          </DetailSection>
          <DetailSection label="3. Enroll">
            <p className="form-control-plaintext fs-5">
              {enrolledCount} {enrolledCount === 1 ? "person" : "people"}{" "}
              enrolled
            </p>
          </DetailSection>
          <DetailSection label="4. Modules">
            <div className="mt-2">
              <button
                className="btn btn-outline-info view-modules-btn"
                onClick={async () => {
                  if (!selectedCourse) return;
                  setModules({ open: true, list: [], loading: true });
                  try {
                    const res = await apiClient.get(
                      `/course-modules/course/${
                        selectedCourse.courseId || selectedCourse.id
                      }`
                    );
                    const data = res.data?.data || [];
                    setModules({ open: true, list: data, loading: false });
                  } catch (e) {
                    setModules({ open: true, list: [], loading: false });
                  }
                }}
              >
                View Modules
              </button>
            </div>
          </DetailSection>
          <DetailSection label="5. Completion">
            <p className="form-control-plaintext fs-5">
              {completedCount} {completedCount === 1 ? "person" : "people"}{" "}
              completed
            </p>
          </DetailSection>
        </DetailModal>

        <Modal
          show={deleteCourse.open}
          onClose={() => setDeleteCourse({ id: null, open: false, reason: "" })}
          title="Delete Course"
        >
          <div className="modal-body">
            <p>Please provide a reason for deletion.</p>
            <textarea
              className="form-control"
              rows={3}
              value={deleteCourse.reason}
              onChange={(e) =>
                setDeleteCourse({ ...deleteCourse, reason: e.target.value })
              }
            />
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteCourse({ id: null, open: false, reason: "" })
              }
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              disabled={!deleteCourse.reason.trim()}
              onClick={async () => {
                try {
                  await apiClient.delete(`/courses/${deleteCourse.id}`, {
                    data: { reason: deleteCourse.reason },
                  });
                  setDeleteCourse({ id: null, open: false, reason: "" });
                  refetch();
                } catch (e) {
                  alert("Failed to delete course");
                }
              }}
            >
              Delete
            </button>
          </div>
        </Modal>

        <Modal
          show={modules.open}
          onClose={() => setModules({ open: false, list: [], loading: false })}
          title="Modules"
        >
          <div className="modal-body">
            {modules.loading ? (
              <p>Loading modules...</p>
            ) : (
              <div>
                <h5 className="mb-3">Module Title</h5>
                <div className="module-list">
                  {modules.list.map((m, idx) => (
                    <div key={m.moduleId || idx} className="module-item">
                      {m.title}
                    </div>
                  ))}
                  {modules.list.length === 0 && (
                    <div className="text-center text-secondary py-3">
                      No modules available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setModules({ open: false, list: [], loading: false })
              }
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function EnrollmentTab() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllEnrollments = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch all students
      const studentsRes = await apiClient.get("/students");
      const students = studentsRes.data || [];

      // Fetch enrollments for each student
      const enrollmentPromises = students.map(async (student) => {
        try {
          const enrollmentRes = await apiClient.get(
            `/enrollments/student/${student.id}`
          );
          const studentEnrollments = enrollmentRes.data?.data || [];

          // Fetch course details for each enrollment
          const enrollmentsWithDetails = await Promise.all(
            studentEnrollments.map(async (enrollment) => {
              try {
                const courseRes = await apiClient.get(
                  `/courses/${enrollment.courseId}`
                );
                const course = courseRes.data?.data || courseRes.data;
                return {
                  ...enrollment,
                  studentName: `${student.firstName} ${student.lastName}`,
                  courseName:
                    course?.title || `Course ID: ${enrollment.courseId}`,
                };
              } catch (e) {
                return {
                  ...enrollment,
                  studentName: `${student.firstName} ${student.lastName}`,
                  courseName: `Course ID: ${enrollment.courseId}`,
                };
              }
            })
          );
          return enrollmentsWithDetails;
        } catch (e) {
          return [];
        }
      });

      const allEnrollments = (await Promise.all(enrollmentPromises)).flat();
      setEnrollments(allEnrollments);
    } catch (e) {
      setError("Failed to load enrollments");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEnrollments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", "");
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    { key: "studentName", label: "Student" },
    { key: "courseName", label: "Course Name" },
    {
      key: "enrollmentDate",
      label: "Enrolled Date",
      render: (e) => formatDate(e.enrollmentDate),
    },
    {
      key: "completionStatus",
      label: "Completion status",
      render: (e) => e.completionStatus || "N/A",
    },
  ];

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <h5 className="card-title m-0 text-info mb-3">Enrollment List</h5>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {loading ? (
          <div className="loading-container">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading enrollments...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={enrollments}
            emptyMessage="No enrollments found"
          />
        )}
      </div>
    </div>
  );
}
