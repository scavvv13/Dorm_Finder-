import React from "react";

const Card = ({ name, paxSize, monthlyFees, pictureUrl, onEdit, onDelete }) => {
  return (
    <div className="card card-compact bg-base-100 w-68 shadow-xl">
      <figure>
        <img src={pictureUrl} alt={name} className="object-cover h-48 w-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p className="text-sm text-gray-600">Pax Size: {paxSize}</p>
        <p className="text-sm text-gray-600">Monthly Fees: ${monthlyFees}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-secondary" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn-error ml-2" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
