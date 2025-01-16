/*
  # Update Form Settings for Pallet Racking Audit
  
  1. Changes
    - Update form field settings for pallet racking audit
    - Add new fields for damage records
    - Update field types and options
  
  2. Security
    - Maintains existing RLS policies
*/

-- Update form field settings
UPDATE settings 
SET value = '{
  "auditorName": {
    "type": "text",
    "label": "Auditor Name",
    "required": true
  },
  "siteName": {
    "type": "text",
    "label": "Site Name",
    "required": true
  },
  "companyName": {
    "type": "text",
    "label": "Company Name",
    "required": true
  },
  "auditDate": {
    "type": "date",
    "label": "Audit Date",
    "required": true
  },
  "damageType": {
    "type": "select",
    "label": "Damage Type",
    "required": true,
    "options": [
      "Beam Safety Clips Missing",
      "Upright Damaged",
      "Upright/Footplate Twisted",
      "Footplate Damaged/Missing",
      "Floor Fixing Damaged/Missing",
      "Horizontal Brace Damaged",
      "Diagonal Brace Damaged",
      "Beam Damaged",
      "Beam Dislodged",
      "Row Spacer Damaged/Missing",
      "Mesh Deck missing/damaged",
      "Barrier/Guard Damaged/Missing",
      "Load Sign Incorrect/Missing",
      "Splice Incorrect/Poor Quality",
      "Frames not compatible with Beam"
    ]
  },
  "riskLevel": {
    "type": "select",
    "label": "Risk Level",
    "required": true,
    "options": [
      "RED",
      "AMBER",
      "GREEN"
    ]
  },
  "locationDetails": {
    "type": "text",
    "label": "Location Details",
    "required": true,
    "placeholder": "Aisle-Bay-Level-Side"
  },
  "photo": {
    "type": "file",
    "label": "Damage Photo",
    "required": false,
    "accept": "image/*"
  },
  "notes": {
    "type": "textarea",
    "label": "Notes",
    "required": false
  },
  "recommendation": {
    "type": "text",
    "label": "Recommendation",
    "required": true
  }
}'::jsonb
WHERE key = 'formFields';
