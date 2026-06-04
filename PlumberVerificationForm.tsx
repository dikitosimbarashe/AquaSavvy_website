import React, { useState } from 'react';
import { X, Upload, User, Mail, Phone, MapPin, Award, Calendar, FileText, Camera, Plus } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

interface PlumberVerificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function PlumberVerificationForm({ isOpen, onClose, onSubmit }: PlumberVerificationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    experienceDescription: '',
    specializations: [] as string[],
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [documents, setDocuments] = useState({
    nationalId: null as File | null,
    tradeLicense: null as File | null,
    qualificationCert: null as File | null,
    policeClearance: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (docType: keyof typeof documents, file: File) => {
    setDocuments({ ...documents, [docType]: file });
  };

  const toggleSpecialization = (spec: string) => {
    if (formData.specializations.includes(spec)) {
      setFormData({
        ...formData,
        specializations: formData.specializations.filter((s) => s !== spec),
      });
    } else {
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
      await addDoc(collection(db, 'plumberApplications'), {
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
        createdAt: serverTimestamp()
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
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Plumber Verification Application</h2>
            <p className="text-blue-100 text-sm mt-1">Complete your profile to get verified</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-8">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Profile Photo *</label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border-4 border-blue-200">
                    <User size={48} className="text-blue-400" />
                  </div>
                )}
                <label
                  htmlFor="profile-photo"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Camera size={20} />
                </label>
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium">Upload your professional photo</p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF (max. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Mukuwa"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.mukuwa@gmail.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+263 77 123 4567"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location (City, Country) *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Harare, Zimbabwe"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={20} className="text-blue-600" />
              Professional Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience *</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="8"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Description</label>
                <input
                  type="text"
                  value={formData.experienceDescription}
                  onChange={(e) => setFormData({ ...formData, experienceDescription: e.target.value })}
                  placeholder="Professional plumbing experience"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={20} className="text-purple-600" />
              Specializations *
            </h3>
            <p className="text-sm text-slate-600 mb-3">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {specializationOptions.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpecialization(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.specializations.includes(spec)
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Document Uploads */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Required Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* National ID */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <label htmlFor="national-id" className="cursor-pointer block">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-3 rounded-xl mb-3">
                      <Upload size={24} className="text-blue-600" />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">National ID *</p>
                    {documents.nationalId ? (
                      <p className="text-xs text-green-600 mt-2">✓ {documents.nationalId.name}</p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-2">Click to upload (PDF, max 10MB)</p>
                    )}
                  </div>
                </label>
                <input
                  id="national-id"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleDocumentUpload('nationalId', e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Trade License */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <label htmlFor="trade-license" className="cursor-pointer block">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-3 rounded-xl mb-3">
                      <Upload size={24} className="text-blue-600" />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">Trade License *</p>
                    {documents.tradeLicense ? (
                      <p className="text-xs text-green-600 mt-2">✓ {documents.tradeLicense.name}</p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-2">Click to upload (PDF, max 10MB)</p>
                    )}
                  </div>
                </label>
                <input
                  id="trade-license"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleDocumentUpload('tradeLicense', e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Qualification Certificate */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <label htmlFor="qualification-cert" className="cursor-pointer block">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-3 rounded-xl mb-3">
                      <Upload size={24} className="text-blue-600" />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">Qualification Certificate *</p>
                    {documents.qualificationCert ? (
                      <p className="text-xs text-green-600 mt-2">✓ {documents.qualificationCert.name}</p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-2">Click to upload (PDF, max 10MB)</p>
                    )}
                  </div>
                </label>
                <input
                  id="qualification-cert"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleDocumentUpload('qualificationCert', e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Police Clearance */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <label htmlFor="police-clearance" className="cursor-pointer block">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-3 rounded-xl mb-3">
                      <Upload size={24} className="text-blue-600" />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">Police Clearance *</p>
                    {documents.policeClearance ? (
                      <p className="text-xs text-green-600 mt-2">✓ {documents.policeClearance.name}</p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-2">Click to upload (PDF, max 10MB)</p>
                    )}
                  </div>
                </label>
                <input
                  id="police-clearance"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleDocumentUpload('policeClearance', e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel & Continue Signup
            </button>
            <button
              onClick={handleSubmitForm}
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Your application will be reviewed within 2-3 business days. You'll receive an email notification once approved.
          </p>
        </div>
      </div>
    </div>
  );
}