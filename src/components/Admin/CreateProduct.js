import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles (can be customized)
import {
  infoToast,
  errorToast,
  successToast,
} from "../../DecryptoAndOther/ToastUpdate";
import "../../styles/CreateProduct.scss";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";

const CreateProduct = ({
  product,
  setShowCreateForm,
  fetchProducts,
  userID,
}) => {
  // Add these state variables at the top with other states
  const [showFeatureInput, setShowFeatureInput] = useState(false);
  const [showSpecificationInput, setShowSpecificationInput] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newSpecification, setNewSpecification] = useState({
    property: "",
    value: "",
  });
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
  const [editingSpecificationIndex, setEditingSpecificationIndex] =
    useState(null);
  const [existingMainImage, seteExistingMainImage] = useState(null);
  // Add new state for inventory management
  const [showInventoryInput, setShowInventoryInput] = useState(false);
  // Update the locationNames console log to see the actual data structure
  const locationNames = useSelector((state) => state.product.indiaStatesAndUTs);
  //console.log("Location Names:", locationNames); // Add this to check the data structure
  const [newInventory, setNewInventory] = useState({
    location: "",
    quantity: "",
  });
  const [editingInventoryIndex, setEditingInventoryIndex] = useState(null);
  // Update the initial state
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    productUsp: "",
    description: "",
    category: "",
    status: "", // Ensure this is part of the initial state
    mrp: "",
    tenure:"",
    inventory: [],
    discount: "",
    coin: "",
    type: "",
    productImage: null,
    subProductImages: [], // Changed from subProductImage to subProductImages array
    productFeatures: [],
    productSpecifications: [],
  });

  // Update the handleSubmit function
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formDataToSend = new FormData();
  
      // Create a processed version of the data
      const processedData = {
        ...formData,
        ...(existingMainImage ? { existingMainImage: product.productImage } : null),
        inventory: JSON.stringify(formData.inventory),
        productFeatures: JSON.stringify(formData.productFeatures),
        productSpecifications: JSON.stringify(formData.productSpecifications)
      };
  
      // Append all non-file fields
      Object.entries(processedData).forEach(([key, value]) => {
        if (key !== "subProductImages" && key !== "productImage") {
          formDataToSend.append(key, value);
        }
      });
      
      // Determine update type and handle images
    let updateType = 'none';
    
    // Handle main product image
    if (formData.productImage instanceof File) {
      formDataToSend.append("productImage", formData.productImage);
      updateType = 'main';
    } else if (existingMainImage) {
      formDataToSend.append("existingMainImage", existingMainImage);
    }

    // Handle sub-product images
    if (Array.isArray(formData.subProductImages) && formData.subProductImages.some(img => img instanceof File)) {
      formData.subProductImages.forEach((image) => {
        if (image instanceof File) {
          formDataToSend.append("subProductImages", image);
        }
      });
      updateType = updateType === 'main' ? 'both' : 'sub';
    }
  
      formDataToSend.append("userID", userID);
      console.log("FormData Content:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
      console.log(updateType);
      try {
        const method = product ? "PUT" : "POST";
        const url = product
          ? `${process.env.REACT_APP_BACK_URL}/admin/updateProduct/${product._id}/${updateType!== 'none'? `?updateType=${updateType}` : ''}`
          : `${process.env.REACT_APP_BACK_URL}/admin/addProduct`;
  
        const response = await fetch(url, { 
          method, 
          body: formDataToSend
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          errorToast(errorData.message || "Failed to save product");
          return;
        }
  
        const data = await response.json();
        successToast(data.message);
        setShowCreateForm(false);
        fetchProducts();
      } catch (error) {
        errorToast(`Error while saving the product: ${error}`);
      }
    };
  const handleChange = (e) => {
    //console.log(e.target);
    const { name, value } = e.target;
    //console.log(formData);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    //console.log(e);
    setFormData((prev) => ({ ...prev, productImage: e.target.files[0] }));
  };

  // Replace the empty handleAddFeatures function with this
  const handleAddFeatures = (e) => {
    setShowFeatureInput(true);
  };
  const handleFeatureSubmit = (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
  
    if (editingFeatureIndex !== null) {
      // Update existing feature
      const updatedFeatures = [...formData.productFeatures];
      updatedFeatures[editingFeatureIndex] = newFeature;
      setFormData((prev) => ({ ...prev, productFeatures: updatedFeatures }));
      setEditingFeatureIndex(null);
    } else {
      // Add new feature
      setFormData((prev) => ({
        ...prev,
        productFeatures: [...prev.productFeatures, newFeature],
      }));
    }
    setNewFeature("");
    setShowFeatureInput(false);
  };
  const handleEditFeature = (index) => {
    setNewFeature(formData.productFeatures[index]);
    setEditingFeatureIndex(index);
    setShowFeatureInput(true);
  };
  const handleDeleteFeature = (index) => {
    const updatedFeatures = formData.productFeatures.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, productFeatures: updatedFeatures }));
  };

  // add below functions for product Specification
  const handleAddSpecifications = (e) => {
    setShowSpecificationInput(true);
  };
  const handleSpecificationSubmit = (e) => {
    e.preventDefault();
    if (!newSpecification.property.trim() || !newSpecification.value.trim())
      return;
  
    if (editingSpecificationIndex !== null) {
      // Update existing specification
      const updatedSpecifications = [...formData.productSpecifications];
      updatedSpecifications[editingSpecificationIndex] = newSpecification;
      setFormData((prev) => ({
        ...prev,
        productSpecifications: updatedSpecifications,
      }));
      setEditingSpecificationIndex(null);
    } else {
      // Add new specification
      setFormData((prev) => ({
        ...prev,
        productSpecifications: [
          ...prev.productSpecifications,
          newSpecification,
        ],
      }));
    }
    setNewSpecification({ property: "", value: "" });
    setShowSpecificationInput(false);
  };
  const handleEditSpecification = (index) => {
    setNewSpecification(formData.productSpecifications[index]);
    setEditingSpecificationIndex(index);
    setShowSpecificationInput(true);
  };
  const handleDeleteSpecification = (index) => {
    const updatedSpecifications = formData.productSpecifications.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      productSpecifications: updatedSpecifications,
    }));
  };

  // Add inventory management functions
  const handleAddInventory = (e) => {
    e.preventDefault();
    setShowInventoryInput(true);
  };
  const handleInventorySubmit = (e) => {
    e.preventDefault();
    if (!newInventory.location.trim() || !newInventory.quantity.trim()) return;
  
    if (editingInventoryIndex !== null) {
      const updatedInventory = [...formData.inventory];
      updatedInventory[editingInventoryIndex] = newInventory;
      setFormData((prev) => ({ ...prev, inventory: updatedInventory }));
      setEditingInventoryIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        inventory: [...prev.inventory, newInventory],
      }));
    }
    setNewInventory({ location: "", quantity: "" });
    setShowInventoryInput(false);
  };
  const handleEditInventory = (index) => {
    setNewInventory(formData.inventory[index]);
    setEditingInventoryIndex(index);
    setShowInventoryInput(true);
  };
  const handleDeleteInventory = (index) => {
    const updatedInventory = formData.inventory.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, inventory: updatedInventory }));
  };

  // For displaying a preview image
  const previewImage = formData.productImage
    ? formData.productImage instanceof File
      ? URL.createObjectURL(formData.productImage)
      : `${process.env.REACT_APP_BACK_URL}${formData.productImage}`
    : "";

  // Add new handler for sub-product images
  const handleSubProductImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      errorToast("Maximum 3 sub-product images allowed");
      return;
    }
    setFormData((prev) => ({ ...prev, subProductImages: files }));
  };

  // Update useEffect for editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        subTitle: product.subTitle || "",
        productUsp: product.productUsp || "",
        description: product.description || "",
        category: product.category || "",
        status: product.status || "", // Ensure status is set
        mrp: product.mrp || "",
        inventory: product.inventory || [],
        discount: product.discount || "",
        coin: product.coin || "",
        productImage: product.productImage || null, // Handle image separately if necessary
        subProductImages: product.subProductImages || [], // Handle sub image separately if necessary
        productFeatures: product.productFeatures || [],
        productSpecifications: product.productSpecifications || [],
      });
      seteExistingMainImage(product.productImage);
    }
  }, [product]);
  console.log(product);
  return (
    <div className="create-product">
      <form onSubmit={handleSubmit}>
        <div className="create-product__main">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sub - Title</label>
            <input
              type="text"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Shot Features</label>
            <input
              type="text"
              name="productUsp"
              value={formData.productUsp}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <ReactQuill
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev, // Preserve all existing form data
                  description: value, // Only update the description
                }))
              }
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline"],
                  ["link"],
                  [{ align: [] }],
                  ["image"],
                ],
              }}
              formats={[
                "header",
                "font",
                "list",
                "bold",
                "italic",
                "underline",
                "link",
                "align",
                "image",
              ]}
            />
          </div>
          {/* Image Upload Section */}
          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              name="productImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Product Preview" width="100" />
              </div>
            )}
          </div>
          {/* multiple Image Upload Section */}
          <div className="form-group">
            <label>Sub Product Images (Max 3)</label>
            <input
              type="file"
              name="subProductImages"
              accept="image/*"
              onChange={handleSubProductImages}
              multiple
            />
            <div className="flex gap-2 mt-2">
              {formData.subProductImages?.map((image, index) => (
                <div key={index} className="image-preview">
                  <img
                    src={
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : `${process.env.REACT_APP_BACK_URL}${image}`
                    }
                    alt={`Sub Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="create-product__sidebar">
          <div className="form-group">
            <label>MRP</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Discount</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Coins</label>
            <input
              type="number"
              name="coin"
              value={formData.coin}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Product Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">Select Product Type</option>
              <option value="TypeA">Type A</option>
              <option value="TypeB">Type B</option>
              <option value="TypeC">Type C</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tenure</label>
            <select
              name="tenure"
              value={formData.tenure}
              onChange={handleChange}
            >
              <option value="">Select Product Tenure</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Product Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Product Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Product Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Security">Security</option>
              <option value="CCTV">CCTV</option>
            </select>
          </div>
          <div className="form-group">
            <label className="!flex flex-row justify-between">
              Inventory Management:
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleAddInventory}
              >
                <Plus size={20} className="ml-1" />
              </button>
            </label>

            {formData.inventory.length > 0 && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b">Location</th>
                      <th className="text-left p-3 border-b">Quantity</th>
                      <th className="text-right p-3 border-b w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.inventory.map((inv, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-3">{inv.location}</td>
                        <td className="p-3">{inv.quantity}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleEditInventory(index)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteInventory(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showInventoryInput && (
              <div className="mt-4">
                <div className="!flex flex-row gap-2">
                  <input
                    list={`datalist-locationNames`}
                    value={newInventory.location}
                    onChange={(e) =>
                      setNewInventory((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Enter Location"
                    className="flex-1 p-2 border rounded"
                  />
                  {/* Datalist for Suggestions */}
                  <datalist id={`datalist-locationNames`}>
                    {locationNames &&
                      locationNames &&
                      locationNames.map((item, idx) => (
                        <option
                          key={idx}
                          value={typeof item === "string" ? item : item.value}
                        >
                          {typeof item === "string" ? item : item.label}
                        </option>
                      ))}
                  </datalist>
                  <input
                    type="number"
                    min="0"
                    value={newInventory.quantity}
                    onChange={(e) =>
                      setNewInventory((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    placeholder="Enter Quantity"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={handleInventorySubmit}
                    className="bg-blue-600 text-white px-4 py-2 w-fit rounded hover:bg-blue-700"
                  >
                    {editingInventoryIndex !== null ? (
                      <Pencil size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInventoryInput(false);
                      setNewInventory({ location: "", quantity: "" });
                      setEditingInventoryIndex(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 w-fit rounded hover:bg-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Update the JSX in create-product__main2 section */}
        <div className="create-product__main2">
          <div className="form-group">
            <label className="!flex flex-row justify-between">
              Product Features:
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleAddFeatures}
              >
                <Plus size={20} className="ml-1" />
              </button>
            </label>

            {/* Features Table */}
            {formData.productFeatures.length > 0 && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b">Feature</th>
                      <th className="text-right p-3 border-b w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.productFeatures.map((feature, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-3">{feature}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleEditFeature(index)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFeature(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Feature Input Form */}
            {showFeatureInput && (
              <div className="mt-4">
                <div className="!flex flex-row gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Enter feature"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleFeatureSubmit(e)}
                    className="bg-blue-600 text-white px-4 py-2 w-fit rounded hover:bg-blue-700"
                  >
                    {editingFeatureIndex !== null ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFeatureInput(false);
                      setNewFeature("");
                      setEditingFeatureIndex(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 w-fit rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="!flex flex-row justify-between">
              Product Specifications:
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleAddSpecifications}
              >
                <Plus size={20} className="ml-1" />
              </button>
            </label>

            {/* Features Table */}
            {formData.productSpecifications.length > 0 && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b">Property</th>
                      <th className="text-left p-3 border-b">Value</th>
                      <th className="text-right p-3 border-b w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.productSpecifications.map(
                      (specification, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-3">{specification.property}</td>
                          <td className="p-3">{specification.value}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleEditSpecification(index)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSpecification(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Feature Input Form */}
            {showSpecificationInput && (
              <div className="mt-4">
                <div className="!flex flex-row gap-2">
                  <input
                    type="text"
                    value={newSpecification.property}
                    onChange={(e) =>
                      setNewSpecification((prev) => ({
                        ...prev,
                        property: e.target.value,
                      }))
                    }
                    placeholder="Enter Property"
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={newSpecification.value}
                    onChange={(e) =>
                      setNewSpecification((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="Enter Value"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={handleSpecificationSubmit}
                    className="bg-blue-600 text-white px-4 py-2 w-fit rounded hover:bg-blue-700"
                  >
                    {editingSpecificationIndex !== null ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSpecificationInput(false);
                      setNewSpecification({ property: "", value: "" });
                      setEditingSpecificationIndex(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 w-fit rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {product ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
