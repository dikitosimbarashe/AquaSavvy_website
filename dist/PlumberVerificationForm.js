"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlumberVerificationForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("./firebase");
function PlumberVerificationForm({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = (0, react_1.useState)({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        experienceDescription: '',
        specializations: [],
    });
    const [profilePhoto, setProfilePhoto] = (0, react_1.useState)(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = (0, react_1.useState)('');
    const [documents, setDocuments] = (0, react_1.useState)({
        nationalId: null,
        tradeLicense: null,
        qualificationCert: null,
        policeClearance: null,
    });
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const specializationOptions = [
        'Residential Plumbing',
        'Commercial Plumbing',
        'Leak Repair',
        'Pipe Installation',
        'Drain Cleaning',
        'Water Heater Installation',
        'Emergency Services',
        'Bathroom Renovation',
        'Kitchen Plumbing',
        'Gas Fitting',
    ];
    const handleProfilePhotoChange = (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDocumentUpload = (docType, file) => {
        setDocuments({ ...documents, [docType]: file });
    };
    const toggleSpecialization = (spec) => {
        if (formData.specializations.includes(spec)) {
            setFormData({
                ...formData,
                specializations: formData.specializations.filter((s) => s !== spec),
            });
        }
        else {
            setFormData({
                ...formData,
                specializations: [...formData.specializations, spec],
            });
        }
    };
    const handleSubmitForm = async () => {
        // Validation
        if (!formData.fullName || !formData.email || !formData.phone || !formData.location || !formData.experience) {
            alert('Please fill in all required fields');
            return;
        }
        if (formData.specializations.length === 0) {
            alert('Please select at least one specialization');
            return;
        }
        if (!documents.nationalId || !documents.tradeLicense || !documents.qualificationCert || !documents.policeClearance) {
            alert('Please upload all required documents');
            return;
        }
        setIsSubmitting(true);
        try {
            // Create the application document in Firestore
            await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'plumberApplications'), {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                yearsExperience: Number(formData.experience),
                experienceDescription: formData.experienceDescription,
                specializations: formData.specializations,
                applicationDate: new Date().toISOString().split('T')[0],
                status: 'pending',
                profilePhoto: profilePhotoPreview || 'https://i.pravatar.cc/150?img=11',
                documents: [
                    {
                        id: `national-id-${Date.now()}`,
                        type: 'National ID',
                        fileName: documents.nationalId.name,
                        uploadedDate: new Date().toISOString().split('T')[0],
                        fileUrl: '#'
                    },
                    {
                        id: `trade-license-${Date.now()}`,
                        type: 'Trade License',
                        fileName: documents.tradeLicense.name,
                        uploadedDate: new Date().toISOString().split('T')[0],
                        fileUrl: '#'
                    },
                    {
                        id: `qualification-cert-${Date.now()}`,
                        type: 'Qualification Certificate',
                        fileName: documents.qualificationCert.name,
                        uploadedDate: new Date().toISOString().split('T')[0],
                        fileUrl: '#'
                    },
                    {
                        id: `police-clearance-${Date.now()}`,
                        type: 'Police Clearance',
                        fileName: documents.policeClearance.name,
                        uploadedDate: new Date().toISOString().split('T')[0],
                        fileUrl: '#'
                    }
                ],
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                location: '',
                experience: '',
                experienceDescription: '',
                specializations: [],
            });
            setProfilePhoto(null);
            setProfilePhotoPreview('');
            setDocuments({
                nationalId: null,
                tradeLicense: null,
                qualificationCert: null,
                policeClearance: null,
            });
            onSubmit();
        }
        catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold", children: "Plumber Verification Application" }), (0, jsx_runtime_1.jsx)("p", { className: "text-blue-100 text-sm mt-1", children: "Complete your profile to get verified" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-2 hover:bg-white/20 rounded-full transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 24 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-8 space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-bold text-slate-900 mb-3", children: "Profile Photo *" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [profilePhotoPreview ? ((0, jsx_runtime_1.jsx)("img", { src: profilePhotoPreview, alt: "Profile", className: "w-32 h-32 rounded-full object-cover border-4 border-blue-200" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border-4 border-blue-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 48, className: "text-blue-400" }) })), (0, jsx_runtime_1.jsx)("label", { htmlFor: "profile-photo", className: "absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { size: 20 }) }), (0, jsx_runtime_1.jsx)("input", { id: "profile-photo", type: "file", accept: "image/*", onChange: handleProfilePhotoChange, className: "hidden" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-700 font-medium", children: "Upload your professional photo" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-1", children: "JPG, PNG or GIF (max. 5MB)" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20, className: "text-blue-600" }), "Personal Information"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Full Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.fullName, onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), placeholder: "John Mukuwa", className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Email Address *" }), (0, jsx_runtime_1.jsx)("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "john.mukuwa@gmail.com", className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Phone Number *" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "+263 77 123 4567", className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Location (City, Country) *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), placeholder: "Harare, Zimbabwe", className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { size: 20, className: "text-blue-600" }), "Professional Experience"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Years of Experience *" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: formData.experience, onChange: (e) => setFormData({ ...formData, experience: e.target.value }), placeholder: "8", min: "0", className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Experience Description" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.experienceDescription, onChange: (e) => setFormData({ ...formData, experienceDescription: e.target.value }), placeholder: "Professional plumbing experience", className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { size: 20, className: "text-purple-600" }), "Specializations *"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mb-3", children: "Select all that apply" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: specializationOptions.map((spec) => ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => toggleSpecialization(spec), className: `px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.specializations.includes(spec)
                                            ? 'bg-purple-600 text-white shadow-md'
                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`, children: spec }, spec))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { size: 20, className: "text-blue-600" }), "Required Documents"] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "national-id", className: "cursor-pointer block", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-blue-100 p-3 rounded-xl mb-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 24, className: "text-blue-600" }) }), (0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900 text-sm", children: "National ID *" }), documents.nationalId ? ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-green-600 mt-2", children: ["\u2713 ", documents.nationalId.name] })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-2", children: "Click to upload (PDF, max 10MB)" }))] }) }), (0, jsx_runtime_1.jsx)("input", { id: "national-id", type: "file", accept: ".pdf", onChange: (e) => { var _a; return ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) && handleDocumentUpload('nationalId', e.target.files[0]); }, className: "hidden" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "trade-license", className: "cursor-pointer block", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-blue-100 p-3 rounded-xl mb-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 24, className: "text-blue-600" }) }), (0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900 text-sm", children: "Trade License *" }), documents.tradeLicense ? ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-green-600 mt-2", children: ["\u2713 ", documents.tradeLicense.name] })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-2", children: "Click to upload (PDF, max 10MB)" }))] }) }), (0, jsx_runtime_1.jsx)("input", { id: "trade-license", type: "file", accept: ".pdf", onChange: (e) => { var _a; return ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) && handleDocumentUpload('tradeLicense', e.target.files[0]); }, className: "hidden" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "qualification-cert", className: "cursor-pointer block", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-blue-100 p-3 rounded-xl mb-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 24, className: "text-blue-600" }) }), (0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900 text-sm", children: "Qualification Certificate *" }), documents.qualificationCert ? ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-green-600 mt-2", children: ["\u2713 ", documents.qualificationCert.name] })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-2", children: "Click to upload (PDF, max 10MB)" }))] }) }), (0, jsx_runtime_1.jsx)("input", { id: "qualification-cert", type: "file", accept: ".pdf", onChange: (e) => { var _a; return ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) && handleDocumentUpload('qualificationCert', e.target.files[0]); }, className: "hidden" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "police-clearance", className: "cursor-pointer block", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-blue-100 p-3 rounded-xl mb-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 24, className: "text-blue-600" }) }), (0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-slate-900 text-sm", children: "Police Clearance *" }), documents.policeClearance ? ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-green-600 mt-2", children: ["\u2713 ", documents.policeClearance.name] })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 mt-2", children: "Click to upload (PDF, max 10MB)" }))] }) }), (0, jsx_runtime_1.jsx)("input", { id: "police-clearance", type: "file", accept: ".pdf", onChange: (e) => { var _a; return ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) && handleDocumentUpload('policeClearance', e.target.files[0]); }, className: "hidden" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors", children: "Cancel & Continue Signup" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSubmitForm, disabled: isSubmitting, className: "flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2", children: isSubmitting ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Submitting..."] })) : ('Submit Application') })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-500 text-center", children: "Your application will be reviewed within 2-3 business days. You'll receive an email notification once approved." })] })] }) }));
}
//# sourceMappingURL=PlumberVerificationForm.js.map