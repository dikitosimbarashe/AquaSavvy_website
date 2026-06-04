import { useState, useEffect } from 'react';
import {
  UserCheck,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Download,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Shield,
  Clock,
  X
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface PlumberDocument {
  id: string;
  type: 'National ID' | 'Qualification Certificate' | 'Trade License' | 'Insurance Certificate' | 'Police Clearance';
  fileName: string;
  uploadedDate: string;
  fileUrl: string;
}

interface PlumberApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  yearsExperience: number;
  specializations: string[];
  documents: PlumberDocument[];
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  rating?: number;
  profilePhoto?: string;
}

export default function PlumberVerificationManager() {
  const [applications, setApplications] = useState<PlumberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<PlumberApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PlumberDocument | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(collection(db, 'plumberApplications'), orderBy('applicationDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const apps: PlumberApplication[] = [];
        querySnapshot.forEach((docSnap) => {
          apps.push({ id: docSnap.id, ...docSnap.data() } as PlumberApplication);
        });
        setApplications(apps);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const stats = {
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    total: applications.length
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (application: PlumberApplication) => {
    setSelectedApplication(application);
  };

  const handleViewDocument = (document: PlumberDocument) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleReviewAction = (action: 'approve' | 'reject') => {
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const confirmReview = async () => {
    if (!selectedApplication || !reviewAction) return;

    try {
      const appRef = doc(db, 'plumberApplications', selectedApplication.id);
      await updateDoc(appRef, {
        status: reviewAction === 'approve' ? 'approved' : 'rejected',
        reviewNotes,
        reviewedBy: 'admin@aquasavvy.com',
        reviewedDate: new Date().toISOString().split('T')[0],
        updatedAt: serverTimestamp(),
        rating: reviewAction === 'approve' ? 5 : undefined
      });

      // Update local state
      const updatedApplications = applications.map(app => {
        if (app.id === selectedApplication.id) {
          return {
            ...app,
            status: reviewAction === 'approve' ? 'approved' : 'rejected',
            reviewNotes,
            reviewedBy: 'admin@aquasavvy.com',
            reviewedDate: new Date().toISOString().split('T')[0],
            rating: reviewAction === 'approve' ? 5 : undefined
          } as PlumberApplication;
        }
        return app;
      });

      setApplications(updatedApplications);
      setSelectedApplication(null);
      setShowReviewModal(false);
      setReviewNotes('');
      setReviewAction(null);

      // TODO: Add SMS notification when approved
      if (reviewAction === 'approve') {
        console.log('Sending approval SMS to:', selectedApplication.phone);
        // Implement SMS sending via your provider (e.g., Twilio, Africa's Talking, etc.)
      }
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  const handleDownloadDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <Clock size={12} />
          Pending
        </span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <CheckCircle size={12} />
          Approved
        </span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <XCircle size={12} />
          Rejected
        </span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <UserCheck size={24} />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <p className="text-sm text-blue-100">Total Applications</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} />
            <span className="text-3xl font-bold">{stats.pending}</span>
          </div>
          <p className="text-sm text-yellow-100">Pending Review</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} />
            <span className="text-3xl font-bold">{stats.approved}</span>
          </div>
          <p className="text-sm text-green-100">Approved Plumbers</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <XCircle size={24} />
            <span className="text-3xl font-bold">{stats.rejected}</span>
          </div>
          <p className="text-sm text-red-100">Rejected Applications</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'approved'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === 'rejected'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>
      </div>

      {!selectedApplication ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[900px] text-left relative">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Plumber</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={application.profilePhoto || 'https://i.pravatar.cc/150?img=11'}
                          alt={application.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{application.fullName}</p>
                          <p className="text-xs text-slate-500">ID: {application.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-slate-900 flex items-center gap-1"><Mail size={14} className="text-slate-400" />{application.email}</p>
                        <p className="text-slate-500 flex items-center gap-1 mt-1"><Phone size={14} className="text-slate-400" />{application.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4"><p className="text-sm text-slate-900 flex items-center gap-1"><MapPin size={14} className="text-slate-400" />{application.location}</p></td>
                    <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-900">{application.yearsExperience} years</p><p className="text-xs text-slate-500">{application.specializations.length} specializations</p></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1"><FileText size={16} className="text-blue-500" /><span className="text-sm font-semibold text-slate-900">{application.documents.length}</span><span className="text-xs text-slate-500">docs</span></div></td>
                    <td className="px-6 py-4">{getStatusBadge(application.status)}</td>
                    <td className="px-6 py-4"><button onClick={() => handleViewDetails(application)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"><Eye size={16} />Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No applications found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setSelectedApplication(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">← Back to Applications</button>
              {getStatusBadge(selectedApplication.status)}
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-6">
              <img src={selectedApplication.profilePhoto || 'https://i.pravatar.cc/150?img=11'} alt={selectedApplication.fullName} className="w-24 h-24 rounded-xl object-cover shadow-md" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedApplication.fullName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><Mail size={16} className="text-slate-400" />{selectedApplication.email}</div>
                  <div className="flex items-center gap-2 text-slate-600"><Phone size={16} className="text-slate-400" />{selectedApplication.phone}</div>
                  <div className="flex items-center gap-2 text-slate-600"><MapPin size={16} className="text-slate-400" />{selectedApplication.location}</div>
                  <div className="flex items-center gap-2 text-slate-600"><Calendar size={16} className="text-slate-400" />Applied: {selectedApplication.applicationDate}</div>
                </div>
              </div>
              {selectedApplication.status === 'pending' && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleReviewAction('approve')} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md"><CheckCircle size={20} />Approve</button>
                  <button onClick={() => handleReviewAction('reject')} className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-md"><XCircle size={20} />Reject</button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4"><Award className="text-blue-500" size={20} /><h3 className="text-lg font-bold text-slate-900">Experience</h3></div>
              <p className="text-3xl font-bold text-blue-600">{selectedApplication.yearsExperience} Years</p>
              <p className="text-sm text-slate-500 mt-1">Professional plumbing experience</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4"><Shield className="text-purple-500" size={20} /><h3 className="text-lg font-bold text-slate-900">Specializations</h3></div>
              <div className="flex flex-wrap gap-2">
                {selectedApplication.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">{spec}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4"><FileText className="text-blue-500" size={20} /><h3 className="text-lg font-bold text-slate-900">Submitted Documents</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedApplication.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer" onClick={() => handleViewDocument(doc)}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="text-blue-600" size={24} /></div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{doc.type}</p>
                      <p className="text-xs text-slate-500">{doc.fileName}</p>
                      <p className="text-xs text-slate-400 mt-1">Uploaded: {doc.uploadedDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="p-2 hover:bg-blue-100 rounded-lg transition-colors"><Eye size={18} className="text-blue-600" /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDownloadDocument(doc.fileUrl); }} className="p-2 hover:bg-green-100 rounded-lg transition-colors"><Download size={18} className="text-green-600" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(selectedApplication.status === 'approved' || selectedApplication.status === 'rejected') && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Review Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100"><span className="text-sm text-slate-600">Reviewed By:</span><span className="text-sm font-semibold text-slate-900">{selectedApplication.reviewedBy}</span></div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100"><span className="text-sm text-slate-600">Review Date:</span><span className="text-sm font-semibold text-slate-900">{selectedApplication.reviewedDate}</span></div>
                {selectedApplication.reviewNotes && (<div className="py-2"><span className="text-sm text-slate-600 block mb-2">Review Notes:</span><p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">{selectedApplication.reviewNotes}</p></div>)}
              </div>
            </div>
          )}
        </div>
      )}

      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedDocument.type}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedDocument.fileName}</p>
              </div>
              <button onClick={() => setShowDocumentViewer(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={24} className="text-slate-600" /></button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
              <div className="bg-slate-100 rounded-lg p-12 text-center">
                <FileText size={64} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">Document Preview</p>
                <p className="text-sm text-slate-500 mt-1">In production, this would display the actual document content</p>
                <p className="text-xs text-slate-400 mt-1">File: {selectedDocument.fileName}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button onClick={() => setShowDocumentViewer(false)} className="px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors">Close</button>
              <button onClick={() => handleDownloadDocument(selectedDocument.fileUrl)} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Download size={18} />Download</button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && reviewAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">{reviewAction === 'approve' ? 'Approve Plumber' : 'Reject Application'}</h3>
              <p className="text-sm text-slate-500 mt-1">{reviewAction === 'approve' ? 'This plumber will be verified and added to the platform' : 'Please provide a reason for rejection'}</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">{reviewAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={reviewAction === 'approve' ? 'Add any notes about this approval...' : 'Explain why this application is being rejected...'}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button onClick={() => { setShowReviewModal(false); setReviewNotes(''); setReviewAction(null); }} className="px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
              <button onClick={confirmReview} disabled={reviewAction === 'reject' && !reviewNotes.trim()} className={`px-6 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${reviewAction === 'approve' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>{reviewAction === 'approve' ? (<><CheckCircle size={18} />Approve Plumber</>) : (<><XCircle size={18} />Reject Application</>)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}