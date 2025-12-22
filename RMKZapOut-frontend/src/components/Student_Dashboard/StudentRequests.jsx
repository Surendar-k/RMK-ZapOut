import { useEffect, useState } from "react";
import { Download, Trash2, Edit, Save } from "lucide-react";
import {
  fetchOnDutyRequests,
  cancelOnDutyRequest,
  updateOnDutyRequest,
} from "../../services/onDutyService.jsx";

const STATUS_COLOR = {
  SUBMITTED: "text-gray-400",
  COUNSELLOR_APPROVED: "text-blue-400",
  COORDINATOR_APPROVED: "text-purple-400",
  HOD_APPROVED: "text-green-400",
  WARDEN_APPROVED: "text-yellow-400",
  REJECTED: "text-red-400",
};

const glass = "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl";

const StudentRequests = () => {
  const sessionUser = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModeId, setEditModeId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetchOnDutyRequests(sessionUser.id);
        const liveRequests = res.data.requests?.filter(
          (r) => !["WARDEN_APPROVED", "HOD_APPROVED", "COORDINATOR_APPROVED", "COUNSELLOR_APPROVED"].includes(r.status) && !r.status.includes("REJECTED")
        ) || [];

        const requestsWithStages = liveRequests.map((r) => {
          const stages = [
            { label: "Submitted", status: r.status === "SUBMITTED" ? "Pending" : "Approved" },
            { label: "Counsellor", status: ["COUNSELLOR_APPROVED", "COORDINATOR_APPROVED", "HOD_APPROVED", "WARDEN_APPROVED"].includes(r.status) ? "Approved" : "Pending" },
            { label: "Coordinator", status: ["COORDINATOR_APPROVED", "HOD_APPROVED", "WARDEN_APPROVED"].includes(r.status) ? "Approved" : "Pending" },
            { label: "HOD", status: ["HOD_APPROVED", "WARDEN_APPROVED"].includes(r.status) ? "Approved" : "Pending" },
            { label: "Warden", status: r.status === "WARDEN_APPROVED" ? "Approved" : "Pending" },
          ];
          const currentStage = stages.findIndex((s) => s.status === "Pending");
          return { ...r, stages, currentStage: currentStage === -1 ? stages.length - 1 : currentStage };
        });

        setRequests(requestsWithStages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [sessionUser.id]);

  const handleInputChange = (e, requestId) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [name]: files ? files[0] : value,
      },
    }));
  };

  const handleSave = async (requestId) => {
    try {
      const data = new FormData();
      const rData = formData[requestId];
      data.append("eventType", rData.eventType);
      data.append("eventName", rData.eventName);
      data.append("college", rData.college);
      data.append("location", rData.location);
      data.append("fromDate", rData.fromDate);
      data.append("toDate", rData.toDate);
      if (rData.proofFile) data.append("proofFile", rData.proofFile);

      await updateOnDutyRequest(requestId, data);
      setEditModeId(null);

      // Refresh requests
      const res = await fetchOnDutyRequests(sessionUser.id);
      const updatedRequests = res.data.requests?.filter(
        (r) => !["WARDEN_APPROVED", "HOD_APPROVED", "COORDINATOR_APPROVED", "COUNSELLOR_APPROVED"].includes(r.status) && !r.status.includes("REJECTED")
      ) || [];
      setRequests(updatedRequests);
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  const handleCancel = async (requestId, status) => {
    if (status !== "SUBMITTED") {
      alert("Cannot cancel request after Counsellor approval");
      return;
    }
    try {
      await cancelOnDutyRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel request");
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (requests.length === 0) return <p className="text-white p-6">No live requests found.</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#020617] via-[#041b32] to-[#020617] text-white p-10">
      <h1 className="text-3xl font-semibold mb-6">Live On-Duty Requests</h1>

      {requests.map((request) => {
        const canEdit = request.status === "SUBMITTED";
        const rFormData = formData[request.id] || {
          eventType: request.event_type,
          eventName: request.event_name,
          college: request.college,
          location: request.location,
          fromDate: request.from_date?.split("T")[0] ?? "",
          toDate: request.to_date?.split("T")[0] ?? "",
          proofFile: null,
        };

        return (
          <div key={request.id} className={`${glass} p-6 mb-6`}>
            {editModeId === request.id ? (
              <div className="space-y-4">
                <input type="text" name="eventType" value={rFormData.eventType} onChange={(e) => handleInputChange(e, request.id)} className="w-full p-2 rounded bg-white/20 text-white" />
                <input type="text" name="eventName" value={rFormData.eventName} onChange={(e) => handleInputChange(e, request.id)} className="w-full p-2 rounded bg-white/20 text-white" />
                <input type="text" name="college" value={rFormData.college} onChange={(e) => handleInputChange(e, request.id)} className="w-full p-2 rounded bg-white/20 text-white" />
                <input type="text" name="location" value={rFormData.location} onChange={(e) => handleInputChange(e, request.id)} className="w-full p-2 rounded bg-white/20 text-white" />
                <div className="flex gap-2">
                  <input type="date" name="fromDate" value={rFormData.fromDate} onChange={(e) => handleInputChange(e, request.id)} className="p-2 rounded bg-white/20 text-white" />
                  <input type="date" name="toDate" value={rFormData.toDate} onChange={(e) => handleInputChange(e, request.id)} className="p-2 rounded bg-white/20 text-white" />
                </div>
                <input type="file" name="proofFile" onChange={(e) => handleInputChange(e, request.id)} />
                <button onClick={() => handleSave(request.id)} className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 flex items-center gap-2"><Save size={16} /> Save</button>
              </div>
            ) : (
              <div>
                <p><strong>Event Type:</strong> {request.event_type}</p>
                <p><strong>Event Name:</strong> {request.event_name}</p>
                <p><strong>College:</strong> {request.college}</p>
                <p><strong>Location:</strong> {request.location}</p>
                <p><strong>From:</strong> {request.from_date?.split("T")[0]}</p>
                <p><strong>To:</strong> {request.to_date?.split("T")[0]}</p>
              </div>
            )}

            {/* Approval Progress */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Approval Progress</h3>
              <div className="relative">
                <div className="absolute top-[10px] left-0 right-0 h-[2px] bg-white/10" />
                <div className="absolute top-[10px] h-[2px] bg-cyan-400" style={{ width: `${request.currentStage / (request.stages.length - 1) * 100}%` }} />
                <div className="flex justify-between relative z-10">
                  {request.stages.map((stage, idx) => (
                    <div key={stage.label} className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${idx <= request.currentStage ? "bg-cyan-400" : "bg-gray-500"}`} />
                      <span className="text-xs mt-2 text-center text-gray-300">{stage.label}</span>
                      <span className={`text-xs mt-1 ${STATUS_COLOR[stage.status]}`}>{stage.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
           {/* Actions */}
<div className="flex gap-4 mt-4">
  {canEdit && editModeId !== request.id && (
    <>
      <button
        onClick={() => setEditModeId(request.id)}
        className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 transition"
      >
        <Edit size={16} /> Edit
      </button>
      <button
        onClick={() => handleCancel(request.id, request.status)}
        className="flex items-center gap-2 px-4 py-2 rounded bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
      >
        <Trash2 size={16} /> Cancel
      </button>
    </>
  )}
</div>

          </div>
        );
      })}
    </div>
  );
};

export default StudentRequests;
