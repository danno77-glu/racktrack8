import React, { useState } from 'react';
import { supabase } from '../../supabase';
import './styles.css';

const DAMAGE_TYPES = [
  'Beam Safety Clips Missing',
  'Upright Damaged',
  'Upright/Footplate Twisted',
  'Footplate Damaged/Missing',
  'Floor Fixing Damaged/Missing',
  'Horizontal Brace Damaged',
  'Diagonal Brace Damaged',
  'Beam Damaged',
  'Beam Dislodged',
  'Row Spacer Damaged/Missing',
  'Mesh Deck missing/damaged',
  'Barrier/Guard Damaged/Missing',
  'Load Sign Incorrect/Missing',
  'Splice Incorrect/Poor Quality',
  'Frames not compatible with Beam'
];

const RECOMMENDATIONS = {
  'Beam Safety Clips Missing': 'Replace Safety Beam Clip',
  'Upright Damaged': 'Replace Upright',
  'Upright/Footplate Twisted': 'Straighten Upright/Footplate',
  'Footplate Damaged/Missing': 'Replace Footplate',
  'Floor Fixing Damaged/Missing': 'Replace Floor Fixing',
  'Horizontal Brace Damaged': 'Replace Horizontal Brace',
  'Diagonal Brace Damaged': 'Replace Diagonal Brace',
  'Beam Damaged': 'Replace Beam',
  'Beam Dislodged': 'Re-Engage Dislodged Beam',
  'Row Spacer Damaged/Missing': 'Replace Row Spacer',
  'Mesh Deck missing/damaged': 'Replace Mesh Deck',
  'Barrier/Guard Damaged/Missing': 'Replace Barrier/Guard',
  'Load Sign Incorrect/Missing': 'Replace Load Sign',
  'Splice Incorrect/Poor Quality': 'Replace Splice',
  'Frames not compatible with Beam': 'Unload and replace Frames and or beams'
};

const DamageRecordForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    damage_type: '',
    risk_level: '',
    location_details: '',
    photo_url: null,
    notes: '',
    recommendation: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'damage_type' ? { recommendation: RECOMMENDATIONS[value] } : {})
    }));
  };

  const handlePhotoChange = async (e) => {
    try {
      setUploading(true);
      setUploadError(null);
      const file = e.target.files[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const allowedTypes = ['jpg', 'jpeg', 'png'];
      if (!allowedTypes.includes(fileExt.toLowerCase())) {
        throw new Error('Only JPG and PNG files are allowed');
      }

      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `damage-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audit-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audit-photos')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        photo_url: publicUrl
      }));
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="damage-record-form">
      <div className="form-grid">
        <div className="form-field">
          <label>Damage Type</label>
          <select
            name="damage_type"
            value={formData.damage_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Damage Type</option>
            {DAMAGE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Risk Level</label>
          <select
            name="risk_level"
            value={formData.risk_level}
            onChange={handleChange}
            required
          >
            <option value="">Select Risk Level</option>
            <option value="RED">Red Risk</option>
            <option value="AMBER">Amber Risk</option>
            <option value="GREEN">Green Risk</option>
          </select>
        </div>

        <div className="form-field">
          <label>Location Details</label>
          <input
            type="text"
            name="location_details"
            value={formData.location_details}
            onChange={handleChange}
            placeholder="Aisle-Bay-Level-Side"
            required
          />
        </div>

        <div className="form-field">
          <label>Photo</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handlePhotoChange}
            disabled={uploading}
          />
          {uploading && <span className="upload-status">Uploading...</span>}
          {uploadError && <span className="upload-error">{uploadError}</span>}
          {formData.photo_url && <span className="upload-success">Photo uploaded successfully</span>}
        </div>

        <div className="form-field full-width">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-field full-width">
          <label>Recommendation</label>
          <input
            type="text"
            name="recommendation"
            value={formData.recommendation}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn" disabled={uploading}>
          Add Record
        </button>
      </div>
    </form>
  );
};

export default DamageRecordForm;
