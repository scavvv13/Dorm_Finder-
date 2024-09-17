import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { storage, db } from "../Auth/FirebaseAuth";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddProperty = ({ onAdd }) => {
  const { register, handleSubmit, reset } = useForm();
  const [picture, setPicture] = useState(null);
  const [documents, setDocuments] = useState(null);

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleDocumentsChange = (e) => {
    setDocuments(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    try {
      let pictureUrl = null;
      let documentsUrl = null;

      // Upload picture
      if (picture) {
        const pictureRef = ref(storage, `properties/pictures/${picture.name}`);
        await uploadBytes(pictureRef, picture);
        pictureUrl = await getDownloadURL(pictureRef);
      }

      // Upload legal documents
      if (documents) {
        const documentsRef = ref(
          storage,
          `properties/documents/${documents.name}`
        );
        await uploadBytes(documentsRef, documents);
        documentsUrl = await getDownloadURL(documentsRef);
      }

      // Add property to Firestore
      await addDoc(collection(db, "properties"), {
        ...data,
        pictureUrl,
        documentsUrl,
        createdAt: new Date(),
      });

      onAdd(); // Call the fetchProperties function to refresh the property list
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  return (
    <div className="mb-4">
      <button
        className="btn btn-primary mb-4"
        onClick={() =>
          document
            .getElementById("add-property-form")
            .classList.toggle("hidden")
        }
      >
        Add New Property
      </button>
      <form
        id="add-property-form"
        className="hidden bg-base-200 p-4 rounded shadow-md"
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
          Add Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
