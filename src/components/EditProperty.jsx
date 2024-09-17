import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db, storage } from "../Auth/FirebaseAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProperty = ({ propertyId, onClose, onUpdate }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [picture, setPicture] = useState(null);
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", propertyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const property = docSnap.data();
          setValue("name", property.name);
          setValue("location", property.location);
          setValue("paxSize", property.paxSize);
          setValue("monthlyFees", property.monthlyFees);
          setValue("pictureUrl", property.pictureUrl);
          setValue("documentsUrl", property.documentsUrl);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [propertyId, setValue]);

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleDocumentsChange = (e) => {
    setDocuments(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    try {
      let pictureUrl = data.pictureUrl;
      let documentsUrl = data.documentsUrl;

      // Upload new picture if provided
      if (picture) {
        const pictureRef = ref(storage, `properties/pictures/${picture.name}`);
        await uploadBytes(pictureRef, picture);
        pictureUrl = await getDownloadURL(pictureRef);
      }

      // Upload new documents if provided
      if (documents) {
        const documentsRef = ref(
          storage,
          `properties/documents/${documents.name}`
        );
        await uploadBytes(documentsRef, documents);
        documentsUrl = await getDownloadURL(documentsRef);
      }

      // Update property in Firestore
      const docRef = doc(db, "properties", propertyId);
      await updateDoc(docRef, {
        ...data,
        pictureUrl,
        documentsUrl,
      });

      onUpdate(); // Refresh the property list
      onClose(); // Close the edit form
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="mb-4">
      <form
        className="bg-base-200 p-4 rounded shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Property Name</span>
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Property Name"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            {...register("location")}
            placeholder="Location"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Pax Size</span>
          </label>
          <input
            type="number"
            {...register("paxSize")}
            placeholder="Pax Size"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Monthly Fees ($)</span>
          </label>
          <input
            type="number"
            {...register("monthlyFees")}
            placeholder="Monthly Fees"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Property Picture</span>
          </label>
          <input
            type="file"
            onChange={handlePictureChange}
            className="file-input file-input-bordered"
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Certificate/Legal Documents</span>
          </label>
          <input
            type="file"
            onChange={handleDocumentsChange}
            className="file-input file-input-bordered"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Property
        </button>
        <button
          type="button"
          className="btn btn-secondary ml-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProperty;
