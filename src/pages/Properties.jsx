import React, { useEffect, useState } from "react"; // Ensure useEffect is imported here
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Auth/FirebaseAuth";
import AddProperty from "../components/AddProperty";
import Card from "../components/Card";
import EditProperty from "../components/EditProperty";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPropertyId, setEditingPropertyId] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "properties"));
      const propertyList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProperties(propertyList);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await deleteDoc(doc(db, "properties", id));
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleEdit = (id) => {
    setEditingPropertyId(id);
  };

  const handleCloseEdit = () => {
    setEditingPropertyId(null);
  };

  const handleUpdate = () => {
    fetchProperties();
    handleCloseEdit();
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">My Properties</h1>

      <AddProperty onAdd={fetchProperties} />

      {editingPropertyId && (
        <EditProperty
          propertyId={editingPropertyId}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}

      {loading ? (
        <div className="text-center my-4">
          <span className="loading loading-spinner"></span> Loading
          properties...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <Card
                key={property.id}
                name={property.name}
                paxSize={property.paxSize}
                monthlyFees={property.monthlyFees}
                pictureUrl={property.pictureUrl}
                onEdit={() => handleEdit(property.id)}
                onDelete={() => handleDelete(property.id)}
              />
            ))
          ) : (
            <p>No properties available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;
