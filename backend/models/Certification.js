/**
 * ============================================================
 *  models/Certification.js — The Certification Mongoose Model
 * ============================================================
 *
 * Represents professional certifications shown in the Certifications section.
 */

const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true }, // Certificate title
    issuer:        { type: String, required: true }, // e.g. 'MongoDB University', 'Meta'
    issueDate:     { type: Date, required: true },
    expiryDate:    { type: Date },                   // Optional — some certs expire
    credentialId:  { type: String },                 // Certificate ID number
    credentialUrl: { type: String },                 // Link to verify the credential online
    imageUrl:      { type: String },                 // Badge/certificate image URL
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', CertificationSchema);
